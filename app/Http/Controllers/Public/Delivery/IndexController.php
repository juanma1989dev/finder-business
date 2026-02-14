<?php

namespace App\Http\Controllers\Public\Delivery;

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
            ->where('delivery_id', $user->id)
            ->whereIn('status', [
                OrderStatusEnum::PICKED_UP->value,
                OrderStatusEnum::ON_THE_WAY->value,
            ])
            ->latest()
            ->first();

        return inertia('public/delivery/Index', [
            'activeOrder' => $activeOrder,
        ]);
    }
}