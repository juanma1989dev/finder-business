<?php

namespace App\Domains\Businesses\Dtos\Traits;

trait ArrayableDTO
{
    public function toArray(array $exclude = []): array
    {
        $data = array_map(function ($value) {
            if (is_object($value) && method_exists($value, 'toArray')) {
                return $value->toArray();
            }
            return $value;
        }, get_object_vars($this));

        foreach($exclude as $field){
            unset($data[$field]);
        }

        return $data;
    }
}
