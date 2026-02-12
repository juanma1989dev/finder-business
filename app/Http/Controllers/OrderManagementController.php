<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Flows\OrderFlow;
use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderManagementController extends Controller
{
    public function __construct(
        protected OrderNotificationService $notifications
    )
    {
    }

    public function updateStatus( Request $request, Order $order)
    {
        $current    = strtolower( $order->status );
        $nextStatus = strtolower( $request->input('status', null) ); // validate is required
        $note = $request->input('note', null);

        $canTransition = $this->canTransition($current, $nextStatus);

        if(!$canTransition) {
            return back()->with('error', 'No se puede actualizar el estado del pedido.');
        }

        if ($current === $nextStatus) {
            return back()->with('info', 'El pedido ya tiene ese estado.');
        }

        $order->update([
            'status' => $nextStatus,
            'notes' => $note,
        ]);

        $this->handleStatusSideEffects($order, $nextStatus);

        return back()->with('success', 'Pedido actualizado');
    }

    private function handleStatusSideEffects(Order $order, string $status): void
    {
        match ($status) {
            OrderStatusEnum::CONFIRMED->value =>
                $this->notifications->notifyCustomerConfirmed($order),
            OrderStatusEnum::READY_FOR_PICKUP->value =>
                $this->onReadyForPickup($order),
            OrderStatusEnum::PICKED_UP->value =>
                $this->notifications->notifyCustomerPickedUp($order),
            OrderStatusEnum::ON_THE_WAY->value =>
                $this->notifications->notifyCustomerOnTheWay($order),
            OrderStatusEnum::DELIVERED->value =>
                $this->notifications->notifyCustomerDelivered($order),
            OrderStatusEnum::CANCELLED->value =>
                $this->notifications->notifyCustomerCancelled($order),
            OrderStatusEnum::REJECTED->value =>
                $this->notifications->notifyCustomerRejected($order),
            default => null,
        };
    }

    private function onReadyForPickup(Order $order)
    {
        $order->update([
            'delivery_id' => null,
            'ready_for_pickup_at' => now(),
            'code' => $this->generateCode(),
        ]);

        cache()->forget('available_orders');

        $this->notifications->notifyReadyForPickup($order);
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
