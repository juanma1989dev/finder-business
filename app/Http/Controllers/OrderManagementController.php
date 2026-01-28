<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Flows\OrderFlow;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderManagementController extends Controller
{
    public function updateStatus( Request $request, Order $order)
    {
        $current    = strtolower( $order->status );
        $nextStatus = strtolower( $request->input('status', null) ); // validate is required
        $note = $request->input('note', null);

        $canTransition = $this->canTransition($current, $nextStatus);

        if(!$canTransition) {
            return back()->with('error', 'No se puede actualizar el estado del pedido.');
        }

        $order->update([
            'status' => $nextStatus,
            'notes' => $note,
        ]);


        if ($nextStatus === OrderStatusEnum::READY_FOR_PICKUP->value) {
            $this->onReadyForPickup($order);
        }

        return back()->with('success', 'Pedido actualizado');
    }

    private function onReadyForPickup(Order $order)
    {
        $order->update([
            'delivery_id' => null,
            'ready_for_pickup_at' => now(),
            'code' => $this->generateCode(),
        ]);

        cache()->forget('available_orders');
    }

    private function generateCode(): string
    {
       return str_pad(
            random_int(0, 99999),
            5,
            '0',
            STR_PAD_LEFT
        );
    }

    private function canTransition(string $current, string $next): bool
    {
        $typeUser = Auth::user()->type;

        $flow = OrderFlow::flow()[$typeUser] ?? [];

        return in_array($next, $flow[$current] );
    }
}
