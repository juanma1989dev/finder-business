<?php 

namespace App\Mappers;

use App\Domains\Businesses\Models\Business;
use App\Models\Payments;
use Illuminate\Support\Collection;

class PaymentsMapper 
{
    public static function toArray(Collection $payments): array
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