<?php 

namespace App\Mappers;

use App\Models\Businesses;
use App\Models\Payments;
use Illuminate\Support\Collection;

class PaymentsMapper 
{
    public static function toArray(Collection $payments)
    {
        return $payments->map(function(Payments $payment){
            return [
                'id' => $payment->id,
                'name' => $payment->name,
                'icon' => $payment->icon,
            ];
        })->toArray();
    }
}