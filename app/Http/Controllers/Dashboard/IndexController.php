<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Businesses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{   
    public function index(Request $request)
    {
        $user = Auth::user();


        $business = Businesses::where('user_id', 1)
            ->whereHas('orders', function ($query) {
                $query->whereNotIn('status', OrderStatusEnum::finalStatuses());
            })
            ->with([
                'orders' => function ($query) {
                    $query->whereNotIn('status', OrderStatusEnum::finalStatuses())
                    ->latest();  
                },
                'orders.items',
                'orders.user',
            ])
            ->first();

        $data = [
            'orders' => $business->orders,
            'business' => $business,
        ];

        return inertia('dashboard/business/Index', $data);
    }
}