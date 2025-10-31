<?php

namespace App\DTOs;

use App\DTOs\Traits\ArrayableDTO;
use Illuminate\Http\Request;

class Cord
{
    public function __construct(
        public readonly ?float $lat,
        public readonly ?float $long,
    ) {
    }
}

class LocationBusinessDTO
{
    use ArrayableDTO;

    public function __construct(
        public readonly ?string $location, 
        public readonly ?string $address, 
        public readonly ?Cord $cord,    

    )
    {        
    }

   public static function fromRequest(Request $request): self
    {
        $data = $request->validate([
            'location'    => ['nullable'],
            'address'     => ['nullable'],
            'cords'       => ['nullable', 'array'],
            'cords.lat'   => ['nullable', 'numeric', 'between:-90,90'],
            'cords.long'  => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $cordsData = $data['cords'] ?? null;

        $cords = isset($cordsData['lat'], $cordsData['long'])
            ? new Cord($cordsData['lat'], $cordsData['long'])
            : null;

        return new self(
            $data['location'] ?? null,
            $data['address'] ?? null,
            $cords
        );
    }

}