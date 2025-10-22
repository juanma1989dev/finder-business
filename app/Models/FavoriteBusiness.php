<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteBusiness extends Model
{
    use HasFactory;

    protected $table = 'favorite_business_by_user';

    // No hay primary key
    protected $primaryKey = null;
    public $incrementing = false;
    
    // Esto evita que Eloquent use `id`
    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'id_business',
        'is_favorite'
    ];
}
