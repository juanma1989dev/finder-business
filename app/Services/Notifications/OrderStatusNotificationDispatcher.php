<?php

namespace App\Services\Notifications;


use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Services\Notifications\Handlers\CancelledHandler;
use App\Services\Notifications\Handlers\ConfirmedHandler;
use App\Services\Notifications\Handlers\DeliveredHandler;
use App\Services\Notifications\Handlers\OnTheWayHandler;
use App\Services\Notifications\Handlers\PendingHandler;
use App\Services\Notifications\Handlers\PickupHandler;
use App\Services\Notifications\Handlers\ReadyForPickupHandler;
use App\Services\Notifications\Handlers\RejectedHandler;

class OrderStatusNotificationDispatcher
{
    public function __construct(
        private PendingHandler $pending,
        private ConfirmedHandler $confirmed,
        private ReadyForPickupHandler $ready,
        private PickupHandler $pickedup,
        private OnTheWayHandler $ontheway,
        private DeliveredHandler $delivered,
        private CancelledHandler $cancelled,
        private RejectedHandler $rejected,
    ) {}

    public function dispatch(Order $order, string $status): void
    {
        match ($status) {
            OrderStatusEnum::PENDING->value => $this->pending->handle($order),
            OrderStatusEnum::CONFIRMED->value => $this->confirmed->handle($order),
            OrderStatusEnum::READY_FOR_PICKUP->value => $this->ready->handle($order),
            OrderStatusEnum::PICKED_UP->value => $this->pickedup->handle($order),
            OrderStatusEnum::ON_THE_WAY->value => $this->ontheway->handle($order),
            OrderStatusEnum::DELIVERED->value => $this->delivered->handle($order),
            OrderStatusEnum::CANCELLED->value => $this->cancelled->handle($order),
            OrderStatusEnum::REJECTED->value => $this->rejected->handle($order),
            default => null,
        };
    }
}
