<?php

namespace App\Http\Controllers\Dashboard\Delivery;

use App\Enums\OrderStatusEnum;
use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
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

            $orders = cache()->remember(
                'available_orders',
                30, // segundos (polling ligero)
                function () {
                    return Order::query()
                        ->where('status', OrderStatusEnum::READY_FOR_PICKUP->value)
                        ->whereNull('delivery_id')
                        ->orderBy('ready_for_pickup_at')
                        ->limit(10)
                        ->get();
                }
            );

            return response()->json($orders);
        } catch(Exception $e){
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }   

    public function accept(Request $request, Order $order)
    {
        try {
            $delivery = Auth::user();

            if($delivery->type !== UserTypeEnum::DELIVERY->value) {
                return response()->json(['message' => 'No tienes permisos para realizar esta acción.']);
            }
            
            if (!$delivery->is_available) {
                return response()->json(['message' => 'No estás disponible'], 422);
            }
            

            $hasActiveOrder = Order::where('delivery_id', $delivery->id)
                ->whereIn('status', [
                    OrderStatusEnum::PICKED_UP->value,
                    OrderStatusEnum::ON_THE_WAY->value,
                ])
                ->exists();

            if ($hasActiveOrder) {
                return response()->json(['message' => 'Ya tienes un pedido activo'], 422);
            }

            $updated = Order::where('id', $order->id)
                ->where('status', OrderStatusEnum::READY_FOR_PICKUP->value)
                ->whereNull('delivery_id')
                ->update([
                    'delivery_id' => $delivery->id,
                    'status' => OrderStatusEnum::PICKED_UP->value,
                    'picked_up_at' => now(),
                ]);

            if ($updated === 0) {
                return response()->json([
                    'message' => 'Este pedido ya fue tomado por otro repartidor'
                ], 409);
            }
            
            cache()->forget('available_orders');

            return response()->json([
                'message' => 'Pedido aceptado',
                'order_id' => $order->id,
            ]);
        } catch(Exception $e){
            return response()->json(['message' => $e->getMessage()], 422);
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

            $order->update([
                'status'        => OrderStatusEnum::ON_THE_WAY->value,
                'on_the_way_at' => now(),
            ]);

            // return response()->json([
            //     'message' => 'Pedido en camino',
            // ]);
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

            $order->update([
                'status'        => OrderStatusEnum::DELIVERED->value,
                'delivered_at'  => now(),
            ]);

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
