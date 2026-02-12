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

    public function notifyCustomerOrderConfirmed(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido confirmado ✅',
            "Tu pedido #{$order->id} fue confirmado por el negocio."
        );
    }

    public function notifyCustomerOrderPreparing(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido en preparación 👨‍🍳',
            "Tu pedido está siendo preparado."
        );
    }

    public function notifyCustomerOutForDelivery(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido en camino 🚚',
            "Tu pedido va en camino."
        );
    }

    public function notifyCustomerDelivered(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido entregado 🎉',
            "Tu pedido fue entregado. ¡Disfrútalo!"
        );
    }

    private function sendToUser(User $user, string $title, string $body): void
    {
        // 1️⃣ Obtener tokens activos
        $tokens = $user->fcmTokens()
            ->where('is_active', true)
            ->pluck('token')
            ->unique()
            ->values()
            ->toArray();

        if (empty($tokens)) {
            return;
        }

        // 2️⃣ Armar payload
        $data = [
            'type'  => 'order_status_update',
            'title' => $title,
            'body'  => $body,
            'user_id' => $user->id,
        ];

        // 3️⃣ Enviar FCM
        $this->fcmNotificationService->send($data, $tokens);

        // 4️⃣ Guardar en base de datos (MUY recomendado)
        // $user->notifications()->create([
        //     'title' => $title,
        //     'body'  => $body,
        //     'type'  => 'order',
        //     'data'  => json_encode($data),
        //     'is_read' => false,
        // ]);
    }

     
    public function notifyCustomerConfirmed(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido confirmado ✅',
            "Tu pedido #{$order->id} fue confirmado por el negocio."
        );
    }

    public function notifyCustomerPickedUp(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido recogido 🚴',
            "El repartidor recogió tu pedido."
        );
    }

    public function notifyCustomerOnTheWay(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido en camino 🚚',
            "Tu pedido va en camino."
        );
    }

    public function notifyCustomerCancelled(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido cancelado ❌',
            "Tu pedido fue cancelado."
        );
    }

    public function notifyCustomerRejected(Order $order)
    {
        $this->sendToUser(
            $order->user,
            'Pedido rechazado ❌',
            "El negocio rechazó tu pedido."
        );
    }
}
