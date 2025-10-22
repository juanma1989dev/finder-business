<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessImage extends Model
{
    use HasFactory;

    protected $table = 'business_images';

    public $incrementing = false;       
    protected $keyType = 'string';      

    protected $fillable = [
        'business_id',
        'url',
        'is_primary',
    ];

     protected $casts = [
        'is_primary' => 'boolean',
        'id' => 'string',               
        'business_id' => 'string',      
    ];

    public function business()
    {
        return $this->belongsTo(Businesses::class, 'business_id', 'id');
    }
}
