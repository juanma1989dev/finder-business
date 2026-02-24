<?php 

namespace App\Domains\Orders\Enums; 

enum OrderStatusEnum: string
{
    # Cliente
    case PENDING            = 'pending';            // Esperando confirmación del negocio

    # Negocio
    case CONFIRMED          = 'confirmed';          // Negocio confirmó el pedido y está preparando el pedido
    case READY_FOR_PICKUP   = 'ready_for_pickup';   // El pedido está listo para ser recogido por el repartidor

    # Repartidor
    case DELIVERY_ASSIGNED  = 'delivery_assigned';   // Un repartidor ha sido asignado al pedido
    case PICKED_UP          = 'picked_up';           // El repartidor ha recogido el pedido del negocio
    case DELIVERED          = 'delivered';           // El repartidor ha entregado el pedido al cliente

    # Finales
    case CANCELLED          = 'cancelled';          // El pedido ha sido cancelado por el cliente o el negocio
    case REJECTED           = 'rejected';           // El pedido ha sido rechazado por el negocio (por ejemplo, por falta de stock) 

    public static function values(): array
    {
        return array_map(
            fn ($case) => $case->value,
            self::cases()
        );
    }

    public static function labels(): array
    {
        return [
            self::PENDING->value           => 'Pendiente',
            self::CONFIRMED->value         => 'Confirmado',
            self::READY_FOR_PICKUP->value  => 'Listo para recoger',
            self::DELIVERY_ASSIGNED->value => 'Repartidor asignado',
            self::PICKED_UP->value         => 'Pedido recogido',
            self::DELIVERED->value         => 'Entregado',
            self::CANCELLED->value         => 'Cancelado',
            self::REJECTED->value          => 'Rechazado',
        ];
    }

    public static function finalStatuses(): array
    {
        return array_map(
            fn ($status) => $status->value,
            [self::CANCELLED, self::REJECTED, self::DELIVERED]
        );
    }
}
