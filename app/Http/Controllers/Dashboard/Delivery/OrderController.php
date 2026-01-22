<?php

namespace App\Http\Controllers\Dashboard\Delivery;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function updateStatus(Request $request, Order $order)
    {
        $current = $order->status;
        $nextStatus = $this->getNextStatus($current, $request);

        if (!$nextStatus) {
            return back()->with('error', 'No hay estado siguiente válido');
        }

        $order->update([
            'status' => $nextStatus,
        ]);

        return back()->with('success', 'Pedido actualizado');
    }

    private function getNextStatus(string $current, Request $request): ?string
    {
        $status = $request->input('status', null);

        if ($status) {
            return OrderStatusEnum::fromValue($status);
        }

        $flow = OrderStatusEnum::flow();

        if (!isset($flow[$current]) || empty($flow[$current])) {
            return null;
        }

        $nextStatus = collect($flow[$current])
            ->first(fn ($s) => !in_array($s, [
                OrderStatusEnum::CANCELLED->value,
                OrderStatusEnum::REJECTED->value,
            ]));

        return $nextStatus;
    }
}
