<?php

namespace App\Models;

use App\Domains\Orders\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;

class Businesses extends Model
{
    use HasFactory; 
    use HasSpatial;

    protected $fillable = [
        'category_id',
        'user_id',
        'name',
        'slug',
        'slogan',
        'description',
        'phone',
        'use_whatsapp',
        'cover_image',
        'tags',
        'location',
        'address',
        'cords',
        'is_open'
    ];

    protected $casts = [
        'cords' => Point::class,
        'status' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(BusinessCategory::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(User::class)
            ->using(BusinessUser::class)
            ->withPivot('is_favorite')
            ->wherePivot('is_favorite', true);
    }

    // public function favoritesCount()
    // {
    //     return $this->belongsToMany(User::class)
    //         ->wherePivot('is_favorite', true);
    // }

    public function hours()
    {
        return $this->hasMany(BusinessHour::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function payments()
    {
        return $this->belongsToMany(Payments::class);
    }

    public function socialNetworks()
    {
        return $this->hasOne(BusinessSocialNetwork::class);
    }

    public function productsAndServices()
    {
        return $this->hasMany(BusinessProduct::class);
    }

    public function images()
    {
        return $this->hasMany(BusinessImage::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
 