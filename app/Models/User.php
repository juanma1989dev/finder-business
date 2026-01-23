<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'type',
        'is_available',
        'last_available_at',
        'password',
        'google_id',
        'privacy_accepted',
        'privacy_version',
        'privacy_accepted_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function favorites()
    {
        return $this->belongsToMany(Businesses::class)
            ->using(BusinessUser::class)
            ->withPivot('is_favorite');
    }

    public function businesses2()
    {
        return $this->hasMany(Businesses::class);
    }

    public function businesses() //// Esto deberian ser solo los favoritos
    {
        return $this->belongsToMany(Businesses::class)
            ->using(BusinessUser::class)
            ->withPivot('is_favorite');
    }

    public function activeOrder()
    {
        return $this->hasOne(Order::class)
            ->whereNotIn('status', [
                OrderStatusEnum::DELIVERED->value,
                OrderStatusEnum::CANCELLED->value,
                OrderStatusEnum::REJECTED->value,
            ])
            ->latest();
    }

}
