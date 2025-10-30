<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessHour extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'business_id',  
        'day',
        'open',
        'close',
        'is_open',
    ];

    public function business()
    {
        return $this->belongsTo(Businesses::class, 'business_id', 'id');
    }
}
