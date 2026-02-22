<?php

namespace App\Http\Controllers\Dashboard\Delivery;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Domains\Orders\Notifications\OrderStatusNotificationDispatcher;
use App\Http\Controllers\Controller;
use App\Domains\Users\Models\User;
use App\Domains\Users\Enums\UserTypeEnum;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(
        private OrderStatusNotificationDispatcher $dispatcher
    )
    {
    }

    public function updateStatus(Request $request, Order $order)
    {   
    }

    /************************************************ */
    public function available(Request $request)
    {
        try {
            $delivery = Auth::user();

            if ($delivery->type !== UserTypeEnum::DELIVERY->value) {
                return response()->json([]);
            }

            if(!$delivery->is_available) {
                return response()->json([]);
            }

            $hasActiveOrder = Order::where('delivery_id', $delivery->id)
                ->whereIn('status', [
                    OrderStatusEnum::PICKED_UP->value,
                    OrderStatusEnum::ON_THE_WAY->value,
                ])->exists();
            
            if( $hasActiveOrder ) {
                return response()->json([]);
            }

            // $orders = cache()->remember(
            //     'available_orders',
            //     30, // segundos (polling ligero)
            //     function () {
                    return Order::query()
                        ->where('status', OrderStatusEnum::READY_FOR_PICKUP->value)
                        ->whereNull('delivery_id')
                        ->orderBy('ready_for_pickup_at')
                        ->limit(10)
                        ->get();
            //     }
            // );

            return response()->json($orders);
        } catch(Exception $e){
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }   

    public function accept(Order $order)
    {
        $delivery = User::with('deliveryProfile.status')->find(Auth::id());


        if ($delivery->type !== UserTypeEnum::DELIVERY->value) {
            return response()->json([
                'message' => 'No tienes permisos para realizar esta acción.'
            ], 403);
        }


        if (!$delivery->deliveryProfile?->status->is_available) {
            return response()->json([
                'message' => 'No estás disponible'
            ], 422);
        }

        try {

            DB::beginTransaction();

            // 🔒 Verificar si ya tiene un pedido activo
            $hasActiveOrder = Order::where('delivery_id', $delivery->id)
                ->whereIn('status', [
                    OrderStatusEnum::PICKED_UP->value,
                    OrderStatusEnum::ON_THE_WAY->value,
                ])
                ->lockForUpdate()
                ->exists();

            if ($hasActiveOrder) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Ya tienes un pedido activo'
                ], 422);
            }

            // 🔒 Intentar asignar pedido (update atómico)
            $nextStatus = OrderStatusEnum::PICKED_UP->value;

            $updated = Order::where('id', $order->id)
                ->where('status', OrderStatusEnum::READY_FOR_PICKUP->value)
                ->whereNull('delivery_id')
                ->update([
                    'delivery_id' => $delivery->id,
                    'status' => $nextStatus,
                    'picked_up_at' => now(),
                ]);

            if ($updated === 0) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Este pedido ya fue tomado por otro repartidor'
                ], 409);
            }

            DB::commit();

            $this->dispatcher->dispatch($order, $nextStatus);  

            return response()->json([
                'message' => 'Pedido aceptado correctamente',
                'order_id' => $order->id,
            ], 200);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Error interno al aceptar el pedido'
            ], 500);
        }
    }
    
    public function onTheWay(Request $request, Order $order)
    {
        $delivery = Auth::user();

        try{

            if($delivery->type !== UserTypeEnum::DELIVERY->value){
                return response()->json(['message' => 'No autorizado']);
            }

            if ($order->delivery_id !== $delivery->id) {
                return response()->json(['message' => 'No es tu pedido'], 403);
            }

            if ($order->status !== OrderStatusEnum::PICKED_UP->value) {
                return response()->json([
                    'message' => 'Estado inválido',
                ], 422);
            }

            $nextStatus = OrderStatusEnum::ON_THE_WAY->value;

            $order->update([
                'status'        => $nextStatus,
                'on_the_way_at' => now(),
            ]);

            $this->dispatcher->dispatch($order, $nextStatus);  

            return back();

        }catch(Exception $e){
            // return response()->json(['message' => $e->getMessage()], 422);
            return back()->with('error', $e->getMessage());
        }
    }

    public function delivered(Order $order){
        $delivery = Auth::user();

        try{
            if ($delivery->type !== UserTypeEnum::DELIVERY->value) {
                return response()->json(['message' => 'No autorizado'], 403);
            }

            if ($order->delivery_id !== $delivery->id) {
                return response()->json(['message' => 'No es tu pedido'], 403);
            }

            if ($order->status !== OrderStatusEnum::ON_THE_WAY->value) {
                return response()->json([
                    'message' => 'El pedido no está en camino',
                ], 422);
            }

            $nextStatus = OrderStatusEnum::DELIVERED->value;

            $order->update([
                'status'        => $nextStatus,
                'delivered_at'  => now(),
            ]);

            $this->dispatcher->dispatch($order, $nextStatus);

            // return response()->json([
            //     'message' => 'Pedido entregado correctamente',
            // ]);
            return back();

        }catch(Exception $e){
            // return response()->json(['message' => $e->getMessage()], 422);
            return back()->with('error', $e->getMessage());
        }
    }
}
