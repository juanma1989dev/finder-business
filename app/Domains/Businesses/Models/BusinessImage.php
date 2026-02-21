<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessImage extends Model
{
    use HasFactory;
 
    protected $fillable = [
        'business_id',
        'url',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class, 'business_id', 'id');  
    }
}
