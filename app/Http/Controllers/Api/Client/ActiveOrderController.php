<?php

namespace App\Http\Controllers\Api\Client;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ActiveOrderController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $activeOrder = Order::query()
            ->where('user_id', $user->id)
            ->whereNotIn('status', OrderStatusEnum::finalStatuses() )
            ->with([
                'items:id,order_id,product_name,quantity',
            ])
            ->latest()
            ->first();

        if (!$activeOrder) {
            return response()->json(null);
        }

        return response()->json($activeOrder);
    }
}