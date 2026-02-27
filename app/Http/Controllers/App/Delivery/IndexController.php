<?php

namespace App\Http\Controllers\App\Delivery;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $activeOrder = Order::query()
            ->with(['business', 'user'])
            ->where('delivery_id', $user->id)
            ->whereIn('status', [
                OrderStatusEnum::PICKED_UP->value,
                OrderStatusEnum::DELIVERY_ASSIGNED->value,
            ])
            ->latest()
            ->first();
        
        $ordersDelivered = Order::query()
            ->where('delivery_id', $user->id)
            ->whereIn('status', [
                OrderStatusEnum::DELIVERED->value
            ])
            ->whereDate('updated_at', now()->toDateString())
            ->count();

        return inertia('Delivery/Home', [
            'activeOrder' => $activeOrder,
            'ordersDelivered' => $ordersDelivered,
        ]);
    }
}