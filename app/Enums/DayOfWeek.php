<?php 

namespace App\Enums;

enum DayOfWeek: string
{
    case Monday = '1';
    case Tuesday = '2';
    case Wednesday = '3';
    case Thursday = '4';
    case Friday = '5';
    case Saturday = '6';
    case Sunday = '7';

    public function label(): string
    {
        return match ($this) {
            self::Monday => 'Lunes',
            self::Tuesday => 'Martes',
            self::Wednesday => 'Miércoles',
            self::Thursday => 'Jueves',
            self::Friday => 'Viernes',
            self::Saturday => 'Sábado',
            self::Sunday => 'Domingo',
        };
    }

    public static function all(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function allValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function toOptions(): array
    {
        
        foreach (self::cases() as $case) {
            $options[] = [
                'label' => $case->label(),
                'value' => $case->value,
            ];
        }

        return $options;
    }
}
