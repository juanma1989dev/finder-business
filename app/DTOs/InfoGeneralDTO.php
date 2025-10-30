<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class InfoGeneralDTO
{
    public function __construct(
        public readonly BusinessDTO $business,
        public readonly array $amenities,
        public readonly array $payments,
        public readonly SchedulesDTO $schedules, 
    )
    {
    }

    public static function fromRequest(Request $request): self
    {
        $business = BusinessDTO::fromRequest($request);
        $schedules = SchedulesDTO::fromRequest($request);

        return new self(
            $business,
            $request->amenities,
            $request->payments,
            $schedules
        );
    }
}


