<?php

namespace App\Domains\Businesses\Mappers;

use App\Domains\Businesses\Models\BusinessProductVariation;

class BusinessProductVariationsMapper 
{
    public static function toArray($variations)
    {
        return $variations->map(function(BusinessProductVariation $variation) {
            return [
                "id" => $variation->id,
                "product_id" => $variation->business_product_id,
                "name" => $variation->name,
            ];
        })->toArray();
    }
}
