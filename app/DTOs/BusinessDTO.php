<?php 

namespace App\DTOs;

use App\DTOs\Traits\ArrayableDTO;
use Illuminate\Http\Request;
 

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
        public readonly ?int $user_id,
        public readonly ?string $tags,
        public readonly ?LocationBusinessDTO $location
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
            "tags" => ['nullable']             
        ]);

        $location = LocationBusinessDTO::fromRequest($request);

        return new self(
            $data['name'],
            $data['id_category'],
            $data['description'],
            $data['long_description'],
            $data['phone'],
            $data['use_whatsapp'],
            $request->user()->id,
            $data['tags'] ?? '', 
            $location
        );
    }
}