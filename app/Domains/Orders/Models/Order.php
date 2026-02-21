<?php 

namespace App\Domains\Orders\Models;

use App\Domains\Businesses\Models\Business;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'delivery_id',
        'business_id',
        'status',
        'subtotal',
        'shipping',
        'total',
        'notes',

        'code',
        'code_used_at',
        
        'ready_for_pickup_at'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function business(): BelongsTo /****** */
    {
        return $this->belongsTo(Business::class);
    }
}
