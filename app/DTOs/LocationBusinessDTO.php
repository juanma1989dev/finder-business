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
            'location'    => ['required'],
            'address'     => ['required'],
            'cords'       => ['required', 'array'],
            'cords.lat'   => ['required', 'numeric', 'between:-90,90'],
            'cords.long'  => ['required', 'numeric', 'between:-180,180'],
        ]);


        return new self(
            $data['location'],
            $data['address'],
            new Cord($data['cords']['lat'], $data['cords']['long']),
        );
    }
}