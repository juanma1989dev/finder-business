<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 

class BusinessProduct extends Model
{

    // protected $table = 'business_products'; // ?
    
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

    public $incrementing = false;
    protected $keyType = 'string';

    public function business()
    {
        return $this->belongsTo(Businesses::class, 'business_id', 'id');
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
