<?php 

namespace App\Domains\Orders\Actions;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Domains\Orders\Repositories\Eloquent\OrderItemRepository;
use App\Domains\Orders\Repositories\Eloquent\OrderRepository;
use App\Domains\Orders\Services\OrderPricingService;
use App\Domains\Businesses\Models\BusinessProduct;
use App\Domains\Users\Services\FcmNotificationService;
use App\Domains\Businesses\Services\ProductAvailabilityService;
use Illuminate\Support\Facades\DB;

class BusinessNotificationService
{   
    public function __construct(
        private FcmNotificationService $fcmNotificationService
    )
    {
    }

    public function notifyNewOrder(Order $order): void
    {
        $order->load(['items.business.owner.fcmTokens']);

        $businesses = $order->items
            ->pluck('business')
            ->unique('id');

        foreach ($businesses as $business) {

            $owner = $business->owner;

            if (!$owner || empty($owner->fcmTokens->token)) {
                continue;
            }

            // foreach ($owner->fcmTokens as $fcmToken) {
                $data = [
                    'title' => '🛍️ ¡Nuevo Pedido Recibido!',
                    'body'  => "Has recibido el pedido #{$order->id}. ¡Empieza a prepararlo!",
                    'order_id' => (string) $order->id,
                    'type' => 'new_order_business'
                ];

                $this->fcmNotificationService->send(
                    $data,
                    [$owner->fcmTokens->token]
                );
            // }
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
                'business_id' => $items[0]['business_id'],
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
                    'business_id' => $item['business_id'],
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