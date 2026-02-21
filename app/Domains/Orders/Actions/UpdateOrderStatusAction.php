<?php 

namespace App\Domains\Orders\Actions;

use App\Domains\Orders\Flows\OrderFlow;
use App\Domains\Orders\Models\Order;
use App\Domains\Orders\Notifications\OrderStatusNotificationDispatcher;
use App\Domains\Users\Models\User;
use DomainException;

class UpdateOrderStatusAction
{
    public function __construct(
        private OrderStatusNotificationDispatcher $dispatcher
    ) {}

    public function execute(
        Order $order,
        string $nextStatus,
        ?string $note,
        User $actor
    ): void {

        $current = strtolower($order->status);

        if ($current === $nextStatus) {
            throw new DomainException('El pedido ya tiene ese estado.');
        }

        if (!$this->canTransition($order, $current, $nextStatus, $actor)) {
            throw new DomainException('No se puede actualizar el estado del pedido.');
        }

        $order->update([
            'status' => $nextStatus,
            'notes'  => $note,
        ]);

        $this->dispatcher->dispatch($order, $nextStatus);
    }

    private function canTransition(
        Order $order,
        string $current,
        string $next,
        User $actor
    ): bool {

        $flow = OrderFlow::flow()[$actor->type] ?? [];

        return in_array($next, $flow[$current] ?? []);
    }
}
