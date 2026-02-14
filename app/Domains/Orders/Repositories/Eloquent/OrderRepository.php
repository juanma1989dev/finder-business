<?php

namespace App\Domains\Orders\Repositories\Eloquent;

use App\Domains\Orders\Models\Order;

class OrderRepository
{
    public function create(array $data): Order 
    {
        return Order::create($data);
    }

    public function updateTotals(
        Order $order, float $subtotal, float $shipping = 0
    ): void
    {
        $order->update([
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $subtotal + $shipping
        ]);
    }
}