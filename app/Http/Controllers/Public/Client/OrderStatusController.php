<?php

namespace App\Http\Controllers\Public\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderStatusController extends Controller
{
    public function show(Order $order)
    {
        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'delivery' => $order->delivery_user ? [
                'name' => $order->delivery_user->name,
            ] : null,
            'updated_at' => $order->updated_at,
        ]);
    }
}