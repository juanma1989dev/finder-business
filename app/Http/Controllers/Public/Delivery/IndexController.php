<?php

namespace App\Http\Controllers\Public\Delivery;

use App\Enums\OrderStatusEnum;
use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $activeOrder = null;

        // if($user && $user->type === UserTypeEnum::DELIVERY->value) {
            $activeOrder = Order::query()
                ->where('delivery_id', $user->id)
                ->whereIn('status', [
                    OrderStatusEnum::PICKED_UP->value,
                    OrderStatusEnum::ON_THE_WAY->value,
                ])
                ->latest()
                ->first();
        // }

        return inertia('public/delivery/Index', [
            'activeOrder' => $activeOrder,
        ]);
    }
}