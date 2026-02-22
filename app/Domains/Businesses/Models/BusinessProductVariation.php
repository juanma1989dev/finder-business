<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProductVariation extends Model
{
    use HasFactory;

    protected $table = 'business_product_variations';

    protected $fillable = [
        'product_id',
        'name',
    ];

    public function product()
    {
        return $this->belongsTo(
            BusinessProduct::class,
            'product_id',
            'id'
        );
    }
}
