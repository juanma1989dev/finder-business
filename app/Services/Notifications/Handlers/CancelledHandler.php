<?php

namespace App\Services\Notifications\Handlers;

use App\Models\Order;

class CancelledHandler
{
    public function handle(Order $order): void
    {
        dd(5);
    }
}