<?php 

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BusinessUser extends Pivot   
{
    // protected $table = 'businesses_user';

    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'business_id',
        'is_favorite',
    ];
}
