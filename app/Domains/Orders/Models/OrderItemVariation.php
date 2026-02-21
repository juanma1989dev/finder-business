<?php 

namespace App\Domains\Orders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemVariation extends Model
{
    protected $fillable = [
        'order_item_id',
        'variation_id',
        'variation_name',
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
