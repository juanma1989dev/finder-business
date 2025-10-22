<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NetworksByBusiness extends Model
{
    use HasFactory;

    protected $table = 'social_networks_by_business';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_business',
        'web',
        'instagram',
        'youtube',
        'facebook',
        'tiktok',
        'twitter'
    ];

    public $timestamps = false;

    public function business()
    {
        return $this->belongsTo(Businesses::class, 'id_business', 'id');
    }
}
