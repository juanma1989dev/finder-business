<?php 

namespace App\DTOs;

class ImageDTO
{
    public function __construct(
        public readonly string $filePath,  
        public readonly string $extension,  
        public readonly ?string $mimeType
    ) {}
}