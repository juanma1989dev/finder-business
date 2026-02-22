<?php

namespace App\Domains\Users\Models;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Domains\Businesses\Models\Business;
use App\Domains\Businesses\Models\BusinessUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'type',
        'password',
        'google_id',
        'privacy_accepted',
        'privacy_version',
        'privacy_accepted_at',
    ];
 
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function favorites()
    {
        return $this->belongsToMany(Business::class)
            ->using(BusinessUser::class)
            ->withPivot('is_favorite');
    }

    public function businesses2()
    {
        return $this->hasMany(Business::class);
    }

    public function businesses() //// Esto deberian ser solo los favoritos
    {
        return $this->belongsToMany(Business::class)
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

    public function fcmTokens()
    {
        return $this->hasOne(FcmToken::class);
    }

    public function deliveryProfile()
    {
        return $this->hasOne(DeliveryProfile::class);
    }

    public function isDelivery(): bool
    {
        return $this->deliveryProfile()->exists();
    }
}
