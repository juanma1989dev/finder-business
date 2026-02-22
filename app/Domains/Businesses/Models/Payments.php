<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    use HasFactory;

    protected $table = 'payments';

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
            'business_payments',
            'id_payments',
            'id_business'
        );
    }
}
