<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessSocialNetwork  extends Model
{
    use HasFactory;

    protected $fillable = [
        'businesses_id',
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
        return $this->belongsTo(Businesses::class);
    }
}
