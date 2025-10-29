<?php 

namespace App\DTOs;

use App\DTOs\Traits\ArrayableDTO;
use Illuminate\Http\Request;

class Cord
{
    public function __construct(
        public readonly float $lat,
        public readonly float $long,
    ) {
    }
}

class BusinessDTO
{ 
    use ArrayableDTO;

    public function __construct(
        public readonly string $name,
        public readonly string $id_category,
        public readonly string $description,    
        public readonly string $long_description,    
        public readonly string $phone,    
        public readonly bool $use_whatsapp, 
        
        public readonly string $location, 
        public readonly string $address, 
        public readonly Cord $cord,     
        public readonly int $user_id   
    )
    {
    }

    public static function fromRequest(Request $request) : self
    {
         $data = $request->validate([
            "name" => ['required'],
            "id_category" => ['required'],
            "description" => ['required'],
            "long_description" => ['required'],
            "phone" => ['required'],
            "use_whatsapp" => ['required'],
            
            "location"      => ['required'],
            "address"       => ['required'],
            "cords"         => ['required', 'array'],
            "cords.lat"     => ['required', 'numeric', 'between:-90,90'],
            "cords.long"    => ['required', 'numeric', 'between:-180,180'],
        ]);

        return new self(
            $data['name'],
            $data['id_category'],
            $data['description'],
            $data['long_description'],
            $data['phone'],
            $data['use_whatsapp'],
            $data['location'],
            $data['address'],
            new Cord($data['cords']['lat'], $data['cords']['long']),
            $request->user()->id
        );
    }
}