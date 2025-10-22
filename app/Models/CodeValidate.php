<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeValidate extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si sigue la convención)
    protected $table = 'code_validation';

    // La clave primaria no es autoincremental
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'user_email',
        'code',
        'confirmed'
    ];

    // Si no tienes columnas created_at / updated_at
    public $timestamps = true;
}
