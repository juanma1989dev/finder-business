<?php 

namespace App\DTOs;

class ImageBusinessDTO
{
    public function __construct( 
        public readonly ?ImageDTO $data,
        public readonly ?string $url,
        public readonly bool $isPrimary = false
    ) {}
}
