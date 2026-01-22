<?php 

namespace App\Enums; 

enum OrderStatusEnum: string
{
    # Cliente
    case PENDING            = 'pending';             # Pedido creado

    # Negocio
    case CONFIRMED          = 'confirmed';           # Negocio acepta
    case READY_FOR_PICKUP   = 'ready_for_pickup';    # Pedido listo

    # Repartidor
    case PICKED_UP          = 'picked_up';           # Repartidor recoge
    case ON_THE_WAY         = 'on_the_way';           # En camino
    case DELIVERED          = 'delivered';            # Entregado

    # Finales / Excepciones
    case CANCELLED          = 'cancelled';            # Cancelado
    case REJECTED           = 'rejected';             # Rechazado por negocio

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
            self::PENDING->value          => 'Pendiente',
            self::CONFIRMED->value        => 'Confirmado',
            self::READY_FOR_PICKUP->value => 'Listo para recoger',
            self::PICKED_UP->value        => 'Pedido recogido',
            self::ON_THE_WAY->value       => 'En camino',
            self::DELIVERED->value        => 'Entregado',
            self::CANCELLED->value        => 'Cancelado',
            self::REJECTED->value         => 'Rechazado',
        ];
    }


    public static function flow(): array
    {
        return [
            self::PENDING->value    => [self::REJECTED->value, self::CONFIRMED->value],
            self::CONFIRMED->value  => [self::CANCELLED->value, self::READY_FOR_PICKUP->value],
            
            self::ON_THE_WAY->value => [self::DELIVERED->value],
        ];
    }

    public static function fromValue(string $value): ?string
    {
        return match ($value) {
            self::PENDING->value            => self::PENDING->value,
            self::CONFIRMED->value          => self::CONFIRMED->value,
            self::ON_THE_WAY->value         => self::ON_THE_WAY->value,
            self::READY_FOR_PICKUP->value   => self::READY_FOR_PICKUP->value,
            self::PICKED_UP->value          => self::PICKED_UP->value,
            self::DELIVERED->value          => self::DELIVERED->value,
            self::CANCELLED->value          => self::CANCELLED->value,
            self::REJECTED->value           => self::REJECTED->value,
            default                         => null,
        };
    }
}
