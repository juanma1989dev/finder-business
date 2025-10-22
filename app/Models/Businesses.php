<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;

class Businesses extends Model
{
    use HasFactory; 
    use HasSpatial;

    protected $table = 'business';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'long_description',
        'phone',
        'id_category',
        'user_id',
        'use_whatsapp',
        'cover_image',
        'tags',

        'location',
        'address',
        'cords'
    ];

    protected $casts = [
        'id' => 'string',
        'cords' => Point::class
    ];

  
    // Si no tienes columnas created_at / updated_at
    public $timestamps = false;

    public function category()
    {
        return $this->belongsTo(BusinessCategory::class, 'id_category', 'id');
    }

    public function favorites()
    {
        return $this->hasMany(FavoriteBusiness::class, 'id_business', 'id');
    }

    public function hours()
    {
        return $this->hasMany(BusinessHour::class, 'business_id', 'id');
    }

    public function services()
    {
        return $this->belongsToMany(
            Services::class,          // Modelo de servicios
            'services_by_business',   // Tabla pivote
            'id_business',            // FK en la pivote hacia business
            'id_service'              // FK en la pivote hacia services
        );
    }

    public function payments()
    {
        return $this->belongsToMany(
            Payments::class,          // Modelo de servicios
            'payments_by_business',   // Tabla pivote
            'id_business',            // FK en la pivote hacia business
            'id_payment'              // FK en la pivote hacia services
        );
    }

    public function socialNetworks()
    {
        return $this->hasOne(NetworksByBusiness::class, 'id_business', 'id');
    }

    public function productsAndServices()
    {
        return $this->hasMany(
            ServicesAndProductsByBusiness::class, // Modelo relacionado
            'business_id',                        // Clave foránea en la tabla hija
            'id'                                  // Clave primaria en la tabla padre
        );
    }

    public function images()
    {
        return $this->hasMany(BusinessImage::class, 'business_id', 'id');
    }
}
 