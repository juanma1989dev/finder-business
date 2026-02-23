<?php

namespace App\Http\Controllers\App\Client;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->filled('date')
            ?  Carbon::createFromFormat('Y-m-d', $request->date)
            : now()->startOfDay();

        $orders = Order::with('user')
            ->whereIn('status', [ OrderStatusEnum::DELIVERED ,  OrderStatusEnum::CANCELLED, OrderStatusEnum::REJECTED ])
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
