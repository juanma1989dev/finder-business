<?php

namespace App\Domains\Orders\Repositories\Contracts;

use App\Domains\Orders\Models\OrderItem;
use App\Domains\Shared\Repositories\Contracts\BaseRepositoryInterface;

interface OrderItemRepositoryInterface extends BaseRepositoryInterface
{
    public function createExtras(OrderItem $item, $extras): void;

    public function createVariations(OrderItem $item, $variations): void;
}
