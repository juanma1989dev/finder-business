<?php

namespace App\Domains\Orders\Notifications\Handlers;

use App\Domains\Orders\Models\Order;
use App\Domains\Users\Models\User;
use App\Domains\Users\Services\PushNotificationService;

class DeliveredHandler
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
            'Pedido entregado ✅',
            "El pedido #{$order->id} fue entregado.",
            $extra
        );
    }

    private function getTokens(Order $order)
    {
        $order->loadMissing([
            'user.fcmTokens',
            'business.owner.fcmTokens'
        ]);

        $clientTokens = $order->user?->fcmTokens?->pluck('token')->toArray() ?? [];
        $ownerTokens = $order->business?->owner?->fcmTokens?->pluck('token')->toArray() ?? [];

        $tokens =  array_values(array_unique([
            ...$clientTokens,
            ...$ownerTokens,
        ]));

        return $tokens;
    }
}