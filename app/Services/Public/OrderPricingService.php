<?php 

namespace App\Services\Public;

use App\Models\BusinessProduct;

class OrderPricingService
{
    public function calculateUnitPrice(
        BusinessProduct $product,
        $extras, 
        $variations
    ): float
    {
        $price = $product->price;

        $price += $extras->sum('price');
        $price += 0; // $variations->sum('price');

        return $price;
    }
}
