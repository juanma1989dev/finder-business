<?php

namespace App\Mappers;

use App\Models\BusinessProduct;
use App\Models\ServicesAndProductsByBusiness;
use Illuminate\Support\Collection;

class ProductsAndServicesMapper 
{
    public static function toArray(Collection $products) 
    {
        return $products->map(function(BusinessProduct $product)  {
            $image_url = $product->image_url ? "/storage/{$product->image_url}" : null;

            return [
                "id" => $product->id,
                "business_id" => $product->business_id,
                "category" => $product->product_category_id,
                "name" =>  $product->name,
                "description" =>  $product->description,
                "price" =>  $product->price,
                "duration" =>  $product->duration,
                "isActive" =>  boolval($product->isActive),
                "image_url" => $image_url,
                "extras" => BusinessProductExtrasMapper::toArray($product->extras),
                "variations" => BusinessProductVariationsMapper::toArray($product->variations)
            ];
        })->toArray();
    }
}