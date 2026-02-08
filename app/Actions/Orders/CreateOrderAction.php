<?php 

namespace App\Actions\Orders;

use App\Enums\OrderStatusEnum;
use App\Models\BusinessProduct;
use App\Models\Order;
use App\Repositories\Laravel\OrderItemRepository;
use App\Repositories\Laravel\OrderRepository;
use App\Services\Public\OrderPricingService;
use App\Services\Public\ProductAvailabilityService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Messaging\CloudMessage;

class BusinessNotificationService
{
    public function notifyNewOrder(Order $order): void
    {
        $order->load(['business.owner']);

        $business = $order->business;
        $owner = $business->owner;
        
        if (!$owner || !$owner->fcm_token) {
            return;
        }

        $message = CloudMessage::fromArray([
            'token' => $owner->fcm_token,
            'notification' => [
                'title' => '🛍️ ¡Nuevo Pedido Recibido!',
                'body'  => "Has recibido el pedido #{$order->id}. ¡Empieza a prepararlo!",
            ],
            'data' => [
                'order_id' => (string) $order->id,
                'type'     => 'new_order_business',
            ],
        ]);

        try {
            app('firebase.messaging')->send($message);
        } catch (Exception $e) {
            Log::error("Error notificando al negocio {$business->id}: " . $e->getMessage());
        }
    }
}

class CreateOrderAction
{
    public function __construct(
        protected OrderRepository $orderRepository,
        protected OrderItemRepository $orderItemRepository,
        protected OrderPricingService $orderPricingService,
        protected ProductAvailabilityService $productAvailabilityService,
        protected BusinessNotificationService $businessNotificationService
    )
    {
    }
    
    public function execute(array $items, ?int $userId = null)
    {   
        $order = DB::transaction(function () use ($items, $userId) {

            $order = $this->orderRepository->create([
                'user_id' => $userId,
                'businesses_id' => $items[0]['businesses_id'],
                'status' => OrderStatusEnum::PENDING,
                'subtotal' => 0,
                'total' => 0,
                'shipping' => 0
            ]);

            $subtotal = 0;

            foreach ($items as $item) {

                $variationsIds = collect($item['variations'] ?? [])
                    ->pluck('id')
                    ->all();

                $extrasIds = collect($item['extras'] ?? [])
                    ->pluck('id') 
                    ->all();

                $product = BusinessProduct::with(['extras', 'variations'])
                    ->findOrFail($item['id']);

                $this->productAvailabilityService->ensure($product);

                $extras = $product->extras()->whereIn('id', $extrasIds);
                $variations = $product->variations()->whereIn('id', $variationsIds);

                $unitPrice = $this->orderPricingService->calculateUnitPrice(
                    $product,
                    $extras,
                    $variations
                );

                $totalPrice = $unitPrice * $item['quantity'];
                $subtotal += $totalPrice;

                $orderItem = $this->orderItemRepository->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'total_price' => $totalPrice,
                    'notes' => $data['notes'] ?? null,
                    'business_id' => $item['businesses_id'],
                ]);

                $this->orderItemRepository->createExtras($orderItem, $extras);
                $this->orderItemRepository->createVariations($orderItem, $variations);                
            }

            $this->orderRepository->updateTotals($order, $subtotal);

            session()->pull('cart', []);

            return $order;
        });


        if ($order) {
            $this->businessNotificationService->notifyNewOrder($order);
        }

        return $order;
    }
}