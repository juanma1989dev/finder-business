<?php 

namespace App\Domains\Businesses\Dtos;

class ImageBusinessDTO
{
    public function __construct( 
        public readonly ?ImageDTO $data,
        public readonly ?string $url,
        public readonly bool $isPrimary = false
    ) {}
}
