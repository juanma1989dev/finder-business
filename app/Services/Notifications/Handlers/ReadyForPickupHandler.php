<?php

namespace App\Services\Notifications\Handlers;

use App\Enums\UserTypeEnum;
use App\Models\Order;
use App\Models\User;
use App\Services\Notifications\PushNotificationService;

class DeliveryRepository 
{
    public function available(): array
    {
        return User::where('type', UserTypeEnum::DELIVERY)
            ->whereHas('deliveryProfile.status', function ($q) {
                $q->where('is_available', true);
            })
            ->whereHas('fcmTokens', function ($q) {
                $q->where('is_active', true);
            })
            ->with(['fcmTokens' => function ($q) {
                $q->where('is_active', true);
            }])
            ->get()
            ->pluck('fcmTokens')
            ->flatten()
            ->pluck('token')
            ->unique()
            ->values()
            ->toArray();
    }
}

class ReadyForPickupHandler
{
    public function __construct(
        private PushNotificationService $push,
        private DeliveryRepository $deliveries
    ) {}

    public function handle(Order $order): void
    {
        $clientToken     = $this->getTokens($order);
        $deliveriesToken = $this->deliveries->available();

        $extra = [
            'order_id'      => $order->id,
            'order_status'  => $order->status
        ];

        $tokens = array_merge($clientToken, $deliveriesToken);

        $this->push->notify(
            $tokens,
            'Pedido disponible 🚨',
            "Pedido #{$order->id} disponible.",
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
