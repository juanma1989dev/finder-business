<?php 

namespace App\Domains\Businesses\Services;

use App\Domains\Businesses\Models\BusinessProduct;
use Illuminate\Validation\ValidationException;

class ProductAvailabilityService 
{
    public function ensure(BusinessProduct $product): void
    {
        if(!$product->is_active){
            throw ValidationException::withMessages([
                'product' => "El producto {$product->name} no está disponible",
            ]);
        }
    }
}
