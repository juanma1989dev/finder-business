<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryProfile extends Model
{

    protected $fillable = [
        'user_id',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->hasOne(DeliveryStatus::class);
    }
}