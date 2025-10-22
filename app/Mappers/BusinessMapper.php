<?php

namespace App\Mappers;

use App\Mappers\PaymentsMapper;
use App\Mappers\ProductsAndServicesMapper;
use App\Models\Businesses;
use App\Models\NetworksByBusiness;
use Illuminate\Support\Str;

class BusinessMapper
{
    public static function toArray(Businesses $bussines)
    {
        return [
            'id' => $bussines->id,
            'name' => $bussines->name,
            'phone' => $bussines->phone,
            'use_whatsapp' => $bussines->use_whatsapp,
            'description' => $bussines->description,
            'long_description' => $bussines->long_description,
            'id_category' => $bussines->id_category,
            'address' => $bussines->address,
            'cover_image' => $bussines->cover_image,
            'tags' => Str::of($bussines->tags)->explode(',')->filter()->values()->toArray(),
            'products' => ProductsAndServicesMapper::toArray( $bussines->productsAndServices),
            'amenities' => AmenitiesMapper::toArray($bussines->services),
            'payments' => PaymentsMapper::toArray($bussines->payments) ,
            'schedules' => SchedulesMapper::toArray($bussines->hours),
            'category' => BusinessCategoryMapper::toArray($bussines->category),
            'social_networks' => self::getSocialNetworks($bussines->socialNetworks),
            'images' => BusinessImagesMapper::toArray($bussines->images)
        ];
    }

    private static function getSocialNetworks(?NetworksByBusiness $networks) : array
    {
        if(!$networks) return [];

        return collect(["web", "instagram", "youtube", "facebook", "tiktok", "twitter"])
            ->mapWithKeys(fn($key) => [
                $key => $networks->{$key} ?? null
            ])
            ->filter() 
            ->toArray();
    }
}
 