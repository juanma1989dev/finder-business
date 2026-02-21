<?php

namespace App\Models;

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
