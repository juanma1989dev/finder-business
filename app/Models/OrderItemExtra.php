<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemExtra extends Model
{
    protected $fillable = [
        'order_item_id',
        'extra_id',
        'extra_name',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }
}
