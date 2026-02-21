<?php 

namespace App\Services\Public;

use App\Models\BusinessProduct;
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