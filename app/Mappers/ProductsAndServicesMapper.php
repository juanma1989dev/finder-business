<?php

namespace App\Mappers;

use App\Models\ServicesAndProductsByBusiness;
use Illuminate\Support\Collection;

class ProductsAndServicesMapper 
{
    public static function toArray(Collection $products) 
    {
        return $products->map(function(ServicesAndProductsByBusiness $product)  {
            $image_url = $product->image_url ? "/storage/{$product->image_url}" : "/images/not-found.png";

            return [
                "id" => $product->id,
                "business_id" => $product->business_id,
                "name" =>  $product->name,
                "description" =>  $product->description,
                "price" =>  $product->price,
                "duration" =>  $product->duration,
                "category" =>  $product->category,
                "isActive" =>  boolval($product->isActive),
                "image_url" => $image_url 
            ];
        })->toArray();
    }
}