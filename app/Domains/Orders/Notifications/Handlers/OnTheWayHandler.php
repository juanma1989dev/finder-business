<?php

namespace App\Services\Notifications\Handlers;

use App\Models\Order;
use App\Models\User;
use App\Services\Notifications\PushNotificationService;

class OnTheWayHandler
{
    public function __construct(
        private PushNotificationService $push
    ) {}

    public function handle(Order $order): void
    {
        $tokens = $this->getTokens($order);

        $this->push->notify(
            $tokens,
            'Pedido confirmado ✅',
            "Tu pedido #{$order->id} fue confirmado." 
        );
    }

    private function getTokens(Order $order)
    {
        $user = User::with(['fcmTokens'])->find($order->user_id);
        
        $token = $user->fcmTokens->token;

        return [$token];
    }
}
