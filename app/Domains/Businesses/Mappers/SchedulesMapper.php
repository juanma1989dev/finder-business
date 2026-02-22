<?php 

namespace App\Domains\Businesses\Mappers;

use App\Domains\Businesses\Models\BusinessHour;
use Illuminate\Support\Collection;
use App\Enums\DayOfWeek;

class SchedulesMapper
{
    public static function toArray(Collection $schedules)
    {
        $daysOfWeek = DayOfWeek::toOptions();

        return collect($daysOfWeek)->map(function ($day) use ($schedules) {
            // Buscar horario existente para este día
            $existing = $schedules->firstWhere('day', $day['value']);

            // Valores por defecto si no hay horario
            $open = $existing->open ?? '09:00';
            $close = $existing->close ?? '18:00';

            return [
                'day' => $day['value'],
                'label' => $day['label'],
                'isOpen' => $existing ? boolval($existing->is_open) : false,
                'open' => substr($open, 0, 5),
                'close' => substr($close, 0, 5),
            ];
        })->toArray();
    }
}
