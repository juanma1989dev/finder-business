<?php 

namespace App\Domains\Businesses\Mappers;

use App\Domains\Businesses\Models\BusinessImage;
use Illuminate\Support\Collection;

class BusinessImagesMapper
{
    public static function toArray(Collection $images)
    {
        return $images->map(function(BusinessImage $image){
            return [
                "id"          => $image->id,
                "business_id" => $image->business_id,
                "url"         => $image->url,
                "is_primary"  => boolval($image->is_primary),
            ];
        })->toArray();
    }
}
