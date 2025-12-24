<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BusinessUser extends Pivot   
{
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'business_id',
        'is_favorite',
    ];
}
