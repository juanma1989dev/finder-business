<?php

namespace App\Http\Controllers\App\Client;

use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
// use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function show(Request $request, $orderId)
    {
        $order = Order::with(['items', 'items.variations', 'items.extras'])->findOrFail($orderId);

        $data = [
            'order' => $order
        ];

        return inertia('Client/Order', $data);
    }
}