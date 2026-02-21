<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryStatus extends Model
{
    protected $fillable = [
        'delivery_profile_id',
        'is_available',
        'last_available_at',
    ];

    public function profile()
    {
        return $this->belongsTo(DeliveryProfile::class, 'delivery_profile_id');
    }
}
