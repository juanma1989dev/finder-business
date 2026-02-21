<?php

namespace App\Domains\Orders\Notifications\Handlers;

use App\Domains\Orders\Models\Order;

class CancelledHandler
{
    public function handle(Order $order): void
    {
        dd(5);
    }
}