<?php

namespace App\Domains\Orders\Repositories\Contracts;

use App\Domains\Orders\Models\Order;
use App\Domains\Shared\Repositories\Contracts\BaseRepositoryInterface;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    public function updateTotals(Order $order, float $subtotal, float $shipping = 0): void;
}
