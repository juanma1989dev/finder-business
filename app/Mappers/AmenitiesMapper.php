<?php 

namespace App\Mappers;

use App\Models\Services;
use Illuminate\Support\Collection;

class AmenitiesMapper
{
    public static function toArray(Collection $services )
    {
        return $services->map(function(Services $service)  {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'icon' => $service->icon,
            ];
        })->toArray();
    }
}