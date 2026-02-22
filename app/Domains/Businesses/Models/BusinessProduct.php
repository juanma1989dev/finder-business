<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'business_id',
        'product_category_id',
        'name',
        'description',
        'price',
        'duration',
        'category',
        'is_active',
        'image_url'
    ];

    public function business()
    {
        return $this->belongsTo(Business::class, 'business_id', 'id');
    }

    public function extras()
    {
        return $this->hasMany(BusinessProductExtra::class, 'product_id', 'id');
    }

    public function variations()
    {
        return $this->hasMany(BusinessProductVariation::class, 'product_id', 'id');
    }
}
