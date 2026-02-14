<?php

namespace App\Services\Notifications\Handlers;

use App\Models\Order;

class PendingHandler
{
    public function handle(Order $order): void
    {
        dd(1);
    }
}