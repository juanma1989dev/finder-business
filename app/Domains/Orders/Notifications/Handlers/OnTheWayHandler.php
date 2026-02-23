<?php

namespace App\Domains\Orders\Notifications\Handlers;

use App\Domains\Orders\Models\Order;
use App\Domains\Users\Models\User;
use App\Domains\Users\Services\PushNotificationService;

class OnTheWayHandler
{
    public function __construct(
        private PushNotificationService $push
    ) {}

    public function handle(Order $order): void
    {
        $tokens = $this->getTokens($order);

        $extra = [
            'order' => $order,
        ];

        $this->push->notify(
            $tokens,
            'Pedido en camino 🚚',
            "El pedido #{$order->id} esta en camino.",
            $extra
        );
    }

    private function getTokens(Order $order)
    {
        $user = User::with(['fcmTokens'])->find($order->user_id);
        
        $token = $user->fcmTokens->token;

        return [$token];
    }
}
