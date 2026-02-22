<?php 

namespace App\Domains\Orders\Services;

use App\Domains\Businesses\Models\BusinessProduct;

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
