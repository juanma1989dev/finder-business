<?php

namespace App\Domains\Businesses\Mappers;

use App\Domains\Businesses\Models\Business;
use App\Domains\Businesses\Models\BusinessSocialNetwork;

class BusinessMapper
{
    public static function toArray(Business $business): array
    {
        return [
            'id'                => $business->id,
            'category_id'       => $business->category_id,
            'name'              => $business->name,
            'slug'              => $business->slug, 
            'is_open'           => $business->is_open,
            'phone'             => $business->phone,
            'use_whatsapp'      => $business->use_whatsapp,
            'slogan'            => $business->slogan,
            'description'       => $business->description,
            'address'           => $business->address,
            'cover_image'       => $business->cover_image,
            'cords'             => $business->cords,
            'tags'              => self::tags($business->tags),
            'social_networks'   => [],self::socialNetworks($business->socialNetworks),
           // 'distance'          => $business->distance,

            'products'          => ProductsAndServicesMapper::toArray( $business->productsAndServices),
            'amenities'         => AmenitiesMapper::toArray($business->amenities),
            'payments'          => PaymentsMapper::toArray($business->payments) ,
            'schedules'         => SchedulesMapper::toArray($business->hours),
            'category'          => BusinessCategoryMapper::toArray($business->category),
            'images'            => BusinessImagesMapper::toArray($business->images)
        ];
    }

    public static function toCollection(iterable $businesses)
    {
        return collect($businesses)
            ->map(fn (Business $b) => self::toArray($b))
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
