<?php 

namespace App\Domains\Orders\Models;

use App\Models\Businesses;
use App\Models\BusinessProduct;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'business_id',
        'product_name',
        'unit_price',
        'quantity',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function extras(): HasMany
    {
        return $this->hasMany(OrderItemExtra::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(OrderItemVariation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(BusinessProduct::class, 'product_id', 'id');
    }

    public function business(): BelongsTo  
    {
        return $this->belongsTo(Businesses::class, 'business_id');
    }
}
