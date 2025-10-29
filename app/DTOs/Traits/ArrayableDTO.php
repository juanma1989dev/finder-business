<?php

namespace App\DTOs\Traits;

trait ArrayableDTO
{
    public function toArray(): array
    {
        return array_map(function ($value) {
            if (is_object($value) && method_exists($value, 'toArray')) {
                return $value->toArray();
            }
            return $value;
        }, get_object_vars($this));
    }
}
