<?php

namespace App\Http\Controllers\Dashboard\Client;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->filled('date')
            ?  Carbon::createFromFormat('Y-m-d', $request->date)
            : now()->startOfDay();

        $orders = Order::with('user')
            ->whereNotIn('status', [ OrderStatusEnum::DELIVERED ,  OrderStatusEnum::CANCELLED, OrderStatusEnum::REJECTED ])
            ->whereBetween('created_at', [
                $date->copy()->startOfDay(),
                $date->copy()->endOfDay(),
            ])
            ->orderByDesc('created_at')
            ->get();


        return inertia('client/dashboard/Index', [
            'orders' => $orders,
            'filters' => [
                'date' => $date->toDateString(),
            ],
        ]);
    }
}
