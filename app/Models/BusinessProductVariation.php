<?php

namespace App\Models;

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

    /**
     * Relación con el producto principal
     */
    public function product()
    {
        return $this->belongsTo(
            BusinessProduct::class, // Modelo de productos
            'product_id',                         // FK en esta tabla
            'id'                                  // PK en productos
        );
    }
}
