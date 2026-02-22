<?php

namespace App\Domains\Businesses\Dtos;

use App\Domains\Businesses\Dtos\Traits\ArrayableDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use MatanYadaev\EloquentSpatial\Objects\Point;

class BusinessDTO
{ 
    use ArrayableDTO;

    public function __construct(
        public readonly int $category_id,
        public readonly ?int $user_id,
        public readonly string $name,
        public readonly string $slug, 
        public readonly string $slogan,    
        public readonly string $description,    
        public readonly string $phone,    
        public readonly bool $use_whatsapp, 
        public readonly ?string $tags,
        public readonly ?LocationBusinessDTO $location
    )
    {
    }

    public static function fromRequest(Request $request) : self
    {
        $data = $request->validate([
            "name"          => ['required'],
            "category_id"   => ['required'],
            "slogan"        => ['required'],
            "phone"         => ['required'],
            "use_whatsapp"  => ['required'],
            "tags"          => ['nullable'],
            "description"   => ['nullable'],            
        ]);

        $location = LocationBusinessDTO::fromRequest($request);

        return new self(
            (int)$data['category_id'],
            (int)$request->user()->id,
            $data['name'],
            Str::slug( $data['name'] ),
            $data['slogan'],
            $data['description'] ?? '',
            $data['phone'],
            $data['use_whatsapp'],
            $data['tags'] ?? '', 
            $location
        );
    }

    public function toSave(): array
    {
        $cords = null;

        if( $this->location?->cord?->lat && $this->location?->cord?->long ) {
            $cords = new Point(
                latitude: $this->location->cord->lat,
                longitude: $this->location->cord->long
            );
        }  

        return [
            'category_id'   => $this->category_id,
            'user_id'       => $this->user_id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'slogan'        => $this->slogan,
            'description'   => $this->description,
            'phone'         => $this->phone,
            'use_whatsapp'  => $this->use_whatsapp,
            'tags'          => $this->tags,
            'location'      => $this->location->location ?? null,
            'address'       => $this->location->address ?? null,
            'cords'         => $cords ?? null,
        ];
    }
}
