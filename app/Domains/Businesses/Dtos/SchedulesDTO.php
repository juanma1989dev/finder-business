<?php

namespace App\Domains\Businesses\Dtos;

use App\Domains\Businesses\Dtos\Traits\ArrayableDTO;
use Illuminate\Http\Request;

class Schedule 
{
    use ArrayableDTO;

    public function __construct(
        public readonly int $day,
        public readonly bool $is_open,
        public readonly ?string $open,
        public readonly ?string $close
    )
    {        
    }
}

class SchedulesDTO
{
    public function __construct(
        public readonly array $data
    )
    {        
    }

    public static function fromRequest(Request $request): self
    {
        $schedules = [];

        foreach($request->schedules ?? [] as $schedule) {

            $schedules[] = new Schedule(
                $schedule['day'],
                $schedule['isOpen'] ?? false,
                $schedule['isOpen'] ? $schedule['open'] : null,
                $schedule['isOpen'] ? $schedule['close'] : null,
            );
        }

        return new self(
            $schedules
        );
    }
}
