<?php

namespace App\Domains\Orders\Notifications\Handlers;

use App\Domains\Orders\Models\Order;
use App\Enums\UserTypeEnum;
use App\Domains\Users\Models\User;
use App\Domains\Users\Services\PushNotificationService;

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
