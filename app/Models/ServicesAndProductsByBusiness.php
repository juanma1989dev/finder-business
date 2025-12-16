<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 

class ServicesAndProductsByBusiness extends Model
{

    protected $table = 'services_and_products_by_business';
    
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'duration',
        'category',
        'isActive',
        'id_business',
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
