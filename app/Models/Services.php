<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    use HasFactory;

    protected $table = 'business_services';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'status',
    ];

    public $timestamps = false;

    public function businesses()
    {
        return $this->belongsToMany(
            Businesses::class,
            'services_by_business',
            'id_service',
            'id_business'
        );
    }
}