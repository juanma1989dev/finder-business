<?php

namespace App\Domains\Orders\Notifications\Handlers;

use App\Domains\Orders\Models\Order as ModelsOrder;

class PendingHandler
{
    public function handle(ModelsOrder $order): void
    {
        dd(1);
    }
}