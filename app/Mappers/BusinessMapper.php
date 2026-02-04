<?php

namespace App\Mappers;

use App\Mappers\PaymentsMapper;
use App\Mappers\ProductsAndServicesMapper;
use App\Models\Businesses;
use App\Models\BusinessSocialNetwork;
use Illuminate\Support\Str;

class BusinessMapper
{
    public static function toArray(Businesses $bussines)
    {
        return [
            'id'                => $bussines->id,
            'category_id'       => $bussines->category_id,
            'name'              => $bussines->name,
            'slug'              => $bussines->slug, 
            'is_open'           => $bussines->is_open,
            'phone'             => $bussines->phone,
            'use_whatsapp'      => $bussines->use_whatsapp,
            'slogan'            => $bussines->slogan,
            'description'       => $bussines->description,
            'address'           => $bussines->address,
            'cover_image'       => $bussines->cover_image,
            'tags'              => self::tags($bussines->tags),
            'social_networks'   => self::socialNetworks($bussines->socialNetworks),
            'distance'          => $bussines->distance,

            'products'          => ProductsAndServicesMapper::toArray( $bussines->productsAndServices),
            'amenities'         => AmenitiesMapper::toArray($bussines->amenities),
            'payments'          => PaymentsMapper::toArray($bussines->payments) ,
            'schedules'         => SchedulesMapper::toArray($bussines->hours),
            'category'          => BusinessCategoryMapper::toArray($bussines->category),
            'images'            => BusinessImagesMapper::toArray($bussines->images)
        ];
    }

    public static function toCollection(iterable $businesses)
    {
        return collect($businesses)
            ->map(fn (Businesses $b) => self::toArray($b))
            ->toArray();
    }

    private static function tags(?string $tags) : array
    {
        if(!$tags) return [];

        $tagsArray = explode(',', $tags);
        $tagsArray = array_map('trim', $tagsArray);
        
        return $tagsArray;
    }

    private static function socialNetworks(?BusinessSocialNetwork $networks) : array
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
 