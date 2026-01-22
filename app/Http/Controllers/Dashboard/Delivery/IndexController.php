<?php

namespace App\Http\Controllers\Dashboard\Delivery;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::whereIn('status', ['confirmed', 'on_the_way'])->get();

        $data = [
            'orders' => $orders,
        ];

        return inertia('delivery/Dashboard', $data);
    }
}
