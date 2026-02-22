<?php

namespace App\Domains\Users\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeValidate extends Model
{
    use HasFactory;

    protected $table = 'code_validation';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_email',
        'code',
        'confirmed'
    ];

    public $timestamps = true;
}
