<?php 

namespace App\Enums; 

enum OrderStatusEnum: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case ON_THE_WAY = 'on_the_way';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case REJECTED = 'rejected';

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
            self::PENDING->value => 'Pendiente',
            self::CONFIRMED->value => 'Confirmado',
            self::ON_THE_WAY->value => 'En camino',
            self::DELIVERED->value => 'Entregado',
            self::CANCELLED->value => 'Cancelado',
            self::REJECTED->value => 'Rechazado',
        ];
    }

    public static function flow(): array
    {
        return [
            self::PENDING->value    => [self::CONFIRMED->value, self::CANCELLED->value, self::REJECTED->value],
            self::CONFIRMED->value  => [self::ON_THE_WAY->value, self::CANCELLED->value],
            self::ON_THE_WAY->value => [self::DELIVERED->value],
        ];
    }

    public static function fromValue(string $value): ?string
    {
        return match ($value) {
            self::PENDING->value    => self::PENDING->value,
            self::CONFIRMED->value  => self::CONFIRMED->value,
            self::ON_THE_WAY->value => self::ON_THE_WAY->value,
            self::DELIVERED->value  => self::DELIVERED->value,
            self::CANCELLED->value  => self::CANCELLED->value,
            self::REJECTED->value   => self::REJECTED->value,
            default                 => null,
        };
    }
}
