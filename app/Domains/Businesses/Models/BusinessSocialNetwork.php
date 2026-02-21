<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessSocialNetwork  extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
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
        return $this->belongsTo(Business::class);
    }
}
