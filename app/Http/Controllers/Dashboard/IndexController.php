<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Businesses;
use Illuminate\Http\Request;

class IndexController extends Controller
{   
    public function index(Request $request)
    {
        $user = $request->user();

        $business = Businesses::where('user_id', $user->id)
            ->with([
                'orders' => function ($query) {
                    $query->whereNotIn('status', OrderStatusEnum::finalStatuses())
                    ->latest();  
                },
                'orders.items',
                'orders.user',
            ])->first();

        $orders = $business->orders ?? [];

        $data = [
            'orders' => $orders,
            'business' => $business,
        ];

        return inertia('dashboard/business/Index', $data);
    }
}