<?php

namespace App\DTOs;

use Illuminate\Http\Request;

final class ProductsDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
        public readonly float $price,
        public readonly ?string $duration,
        public readonly int $product_category_id,
        public readonly bool $isActive,

        public readonly ?ImageDTO $image,
        public readonly ?string $image_url,

        public readonly array $extras,
        public readonly array $variations,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'string|max:300|nullable',
            'price'       => 'required|numeric|gt:0',
            'duration'    => 'nullable|string|max:255',
            'category'    => 'required|integer|exists:product_categories,id',
            'isActive'    => 'required|boolean',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'image_url'   => 'nullable|string',

            'extras'              => 'sometimes|array',
            'extras.*.name'       => 'required_with:extras|string|max:255',
            'extras.*.price'      => 'required_with:extras|numeric|gt:0',

            'variations'          => 'sometimes|array',
            'variations.*.name'   => 'required_with:variations|string|max:255',
        ]);

        $imageFile = $request->file('image');

        $image = $imageFile
            ? new ImageDTO(
                filePath: $imageFile->getPathname(),
                extension: $imageFile->getClientOriginalExtension(),
                mimeType: $imageFile->getMimeType()
            )
            : null;

        return new self(
            name: $data['name'],
            description: $data['description'],
            price: (float) $data['price'],
            duration: $data['duration'] ?? null,

            product_category_id: (int) $data['category'],

            isActive: (bool) $data['isActive'],
            
            image: $image,
            image_url: $data['image_url'] ?? null,

            extras: $data['extras'] ?? [],
            variations: $data['variations'] ?? [],
        );
    }

    public function toPersistenceArray(): array
    {
        return [
            'name'                => $this->name,
            'description'         => $this->description,
            'price'               => $this->price,
            'duration'            => $this->duration,
            'product_category_id' => $this->product_category_id,
            'isActive'            => $this->isActive,
        ];
    }
}
