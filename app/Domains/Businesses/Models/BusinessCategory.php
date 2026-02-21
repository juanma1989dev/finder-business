<?php

namespace App\Domains\Businesses\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessCategory extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si sigue la convención)
    protected $table = 'business_categories';

    // La clave primaria no es autoincremental
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'name',
        'status',
        'image',
    ];

    // Si no tienes columnas created_at / updated_at
    public $timestamps = false;

}
