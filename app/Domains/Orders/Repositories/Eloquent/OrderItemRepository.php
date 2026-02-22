<?php 

namespace App\Domains\Orders\Repositories\Eloquent;

use App\Domains\Orders\Models\OrderItem;
use App\Domains\Orders\Models\OrderItemExtra;
use App\Domains\Orders\Models\OrderItemVariation;
use App\Domains\Orders\Repositories\Contracts\OrderItemRepositoryInterface;
use App\Domains\Shared\Repositories\Eloquent\BaseRepository;

class OrderItemRepository extends BaseRepository implements OrderItemRepositoryInterface
{
    public function __construct(OrderItem $model)
    {
        $this->model = $model;
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