<?php

namespace App\Domains\Orders\Repositories\Eloquent;

use App\Domains\Orders\Models\Order;
use App\Domains\Orders\Repositories\Contracts\OrderRepositoryInterface;
use App\Domains\Shared\Repositories\Eloquent\BaseRepository;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        $this->model = $model;
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