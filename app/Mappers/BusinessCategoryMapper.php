<?php

namespace App\Mappers;

use App\Models\BusinessCategory;

class BusinessCategoryMapper
{
    public static function toArray(BusinessCategory $category)
    {
        return [
            "id" => $category->id,
            "name" => $category->name,
            "image" => $category->image
        ];
    }
}