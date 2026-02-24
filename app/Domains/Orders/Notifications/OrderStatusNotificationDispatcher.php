<?php

namespace App\Domains\Orders\Notifications;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Domains\Orders\Notifications\Handlers\CancelledHandler;
use App\Domains\Orders\Notifications\Handlers\ConfirmedHandler;
use App\Domains\Orders\Notifications\Handlers\DeliveredHandler;
use App\Domains\Orders\Notifications\Handlers\DeliveryAssignedHandler;
use App\Domains\Orders\Notifications\Handlers\PendingHandler;
use App\Domains\Orders\Notifications\Handlers\PickupHandler;
use App\Domains\Orders\Notifications\Handlers\ReadyForPickupHandler;
use App\Domains\Orders\Notifications\Handlers\RejectedHandler;

class OrderStatusNotificationDispatcher
{
    public function __construct(
        private PendingHandler $pending,
        private ConfirmedHandler $confirmed,
        private ReadyForPickupHandler $ready,
        private PickupHandler $pickedup,
        private DeliveryAssignedHandler $deliveryAssigned,
        private DeliveredHandler $delivered,
        private CancelledHandler $cancelled,
        private RejectedHandler $rejected,
    ) {}

    public function dispatch(Order $order, string $status): void
    {
        match ($status) {
            # Cliente
            OrderStatusEnum::PENDING->value => $this->pending->handle($order),
            # Negocio
            OrderStatusEnum::CONFIRMED->value => $this->confirmed->handle($order),
            OrderStatusEnum::READY_FOR_PICKUP->value => $this->ready->handle($order),
            # Repartidor
            OrderStatusEnum::DELIVERY_ASSIGNED->value => $this->deliveryAssigned->handle($order),
            OrderStatusEnum::PICKED_UP->value => $this->pickedup->handle($order),
            OrderStatusEnum::DELIVERED->value => $this->delivered->handle($order),
            # Finales
            OrderStatusEnum::CANCELLED->value => $this->cancelled->handle($order),
            OrderStatusEnum::REJECTED->value => $this->rejected->handle($order),
            default => null,
        };
    }
}
