<?php

namespace App\Services;

use App\Enums\UserTypeEnum;
use App\Models\Order;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Exception\Messaging\NotFound;
use Kreait\Firebase\Messaging\CloudMessage;

class OrderNotificationService
{
    public function notifyReadyForPickup(Order $order): void
    {        
        $deliveries = $this->getAvailableDeliveries();

        foreach ($deliveries as $delivery) {
            if (!$delivery->fcm_token) {
                continue;
            }

            $this->sendPush($delivery, $order);
        }
    }

    private function sendPush(User $delivery, Order $order): void
    {
        $message = CloudMessage::fromArray([
            'token' => $delivery->fcm_token,  
            'notification' => [
                'title' => '🚴 Nuevo pedido disponible',
                'body'  => "Pedido #{$order->id} en espera de repartidor",
            ],
            'data' => [
                'order_id' => (string) $order->id,
                'type'     => 'order_available',
            ]
        ]);

        try {
            app('firebase.messaging')->send($message);
        } catch (NotFound $e) {
            $delivery->update(['fcm_token' => null]);
            Log::warning("Token FCM no encontrado para el usuario {$delivery->id}. Eliminado.");
        } catch (Exception $e) {
            Log::error("Fallo al enviar notificación FCM: " . $e->getMessage());
        }
    }

    private function getAvailableDeliveries()
    {
        return User::query()
            ->where('type', UserTypeEnum::DELIVERY)
            ->where('is_available', true)
            // ->whereDoesntHave('activeOrder')
            ->get();
        }
}
