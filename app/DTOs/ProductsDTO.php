<?php 

namespace App\DTOs;

use App\DTOs\Traits\ArrayableDTO;
use Illuminate\Http\Request;

class ProductsDTO
{
    use ArrayableDTO;

    public function __construct(
        public readonly string $name,
        public readonly string $description,
        public readonly float $price,
        public readonly ?string $duration,
        public readonly string $category,
        public readonly bool $isActive,
        public readonly object|string|null $image
    )
    {
    }

    public static function fromRequest(Request $request): self
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|gt:0',
            'duration'    => 'nullable|string|max:255',
            'category'    => 'required|string',
            'isActive'    => 'required|boolean',
            "image"       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', 
        ]);

        return new self(
            $data['name'],
            $data['description'],
            $data['price'],
            $data['duration'],
            $data['category'],
            $data['isActive'],
            $request->file('image', null)
        );
    }
}

