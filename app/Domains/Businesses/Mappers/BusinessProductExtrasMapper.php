<?php

namespace App\Domains\Businesses\Mappers;

use App\Domains\Businesses\Models\BusinessProductExtra;

class BusinessProductExtrasMapper
{
    public static function toArray($extras)
    {
        return $extras->map(function(BusinessProductExtra $extra) {
             return [
                "id" => $extra->id,
                "product_id" => $extra->business_product_id,
                "name" => $extra->name,
                "price" => $extra->price,
            ];
        })->toArray();
    }
}
