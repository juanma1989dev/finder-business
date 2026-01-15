<?php 

namespace App\Repositories\Laravel;

use App\Models\OrderItem;
use App\Models\OrderItemExtra;
use App\Models\OrderItemVariation;

class OrderItemRepository
{
    public function create(array $data)
    {
        return OrderItem::create($data);
    }

    public function createExtras(OrderItem $item, $extras): void
    {
        foreach($extras as $extra){
            OrderItemExtra::create([
                'order_item_id' => $item->id,
                'extra_id' => $extra->id,
                'extra_name' => $extra->name,
                'price' => $extra->price,
            ]);
        }
    }

    public function createVariations(OrderItem $item, $variations): void
    {
        foreach ($variations as $variation) {
            OrderItemVariation::create([
                'order_item_id' => $item->id,
                'variation_id' => $variation->id,
                'variation_name' => $variation->name,
                'price' => $variation->price,
            ]);
        }
    }
}