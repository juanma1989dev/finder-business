<?php

namespace App\Models;

use App\Domains\Businesses\Models\Business;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon',
        'status',
    ];

    public $timestamps = false;

    public function businesses()
    {
        return $this->belongsToMany(
            Business::class,
            'business_amenities',
            'id_service',
            'id_business'
        );
    }
}