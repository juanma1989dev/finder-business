<?php 

namespace App\DTOs;

class ImageBusinessDTO
{
    public function __construct(
        public readonly ?string $filePath,   // Ruta temporal del archivo
        public readonly ?string $url,        // URL externa si aplica
        public readonly bool $isPrimary = false
    ) {}
}
