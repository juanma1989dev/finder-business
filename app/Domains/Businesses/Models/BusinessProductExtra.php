<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProductExtra extends Model
{
    use HasFactory;

    protected $table = 'business_product_extras';

    protected $fillable = [
        'product_id',
        'name',
        'price',
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
