<?php

namespace App\Services;

use App\Enums\UserTypeEnum;
use App\Models\Order;
use App\Models\User;

class OrderNotificationService
{
    public function __construct(private FcmNotificationService $fcmNotificationService)
    {
    }

    public function notifyReadyForPickup(Order $order): void
    {        
        $tokens = $this->getAvailableDeliveryTokens();

        if (empty($tokens)) {
            return;
        }

        $data = [
            'order_id'      => $order->id,
            'order_status'  => $order->status,
            'type'          => 'order_available',
            'title'         => '🚴 Nuevo pedido disponible',
            'body'          => "Pedido #{$order->id} en espera de repartidor"
        ];

        $this->fcmNotificationService->send($data, $tokens);
    }

    private function getAvailableDeliveryTokens(): array
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
