<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessImage extends Model
{
    use HasFactory;
 
    protected $fillable = [
        'businesses_id',
        'url',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Businesses::class, 'businesses_id', 'id');  
    }
}
