<?php 

namespace App\DTOs;

use Illuminate\Http\Request;

class GalleryBusinessDTO
{
    public array $images = [];

    public function __construct(array $images)
    {
        $this->images = $images;
    }

    public static function fromArray(Request $request): self
    {
         $validated = $request->validate([
            'images' => 'nullable|array',
            'images.*.file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:10240',
            'images.*.url' => 'nullable|string',
            'images.*.is_primary' => 'nullable|boolean',
        ]);

        $images = [];

        foreach ($validated['images'] ?? [] as $imagesData) {
            $images[] = new ImageDTO(
                filePath: $imagesData['file'] ?? null,
                url: $imagesData['url'] ?? null,
                isPrimary: $imagesData['is_primary'] ?? false
            ); 
        }

        return new self($images);
    }

    public function isEmpty(): bool
    {
        return empty($this->images);
    }
}