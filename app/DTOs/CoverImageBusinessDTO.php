<?php

namespace App\DTOs;

use Illuminate\Http\Request;
use InvalidArgumentException;

class CoverImageBusinessDTO
{
    public function __construct(
        public readonly string $tmpPath,
        public readonly string $fileName
    ) {}

    public static function fromRequets(Request $request)
    {
        $request->validate([
            'cover_image' => ['required', 'image', 'max:2048'], // Máx 2MB
        ]);

        $file = $request->file('cover_image');

        if (!$file || !$file->isValid()) {
            throw new InvalidArgumentException('Archivo no válido.');
        }

        return new self(
            $file->getPathname(),
            $file->getClientOriginalName()
        );
    }
}