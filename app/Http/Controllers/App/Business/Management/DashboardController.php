<?php

namespace App\Http\Controllers\App\Business\Management;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Domains\Businesses\Models\Business;
use Illuminate\Http\Request;

class DashboardController extends Controller
{   
    public function index(Request $request)
    {
        $user = $request->user();
 
        $data = [
            'business' => fn () => Business::where('user_id', $user->id)->first(),
            'orders' => fn () => Business::where('user_id', $user->id)
                ->first()
                ?->orders()
                ->whereNotIn('status', OrderStatusEnum::finalStatuses())
                ->with(['items', 'user'])
                ->latest()
                ->get(),
                'final_statuses' =>  OrderStatusEnum::finalStatuses(),
        ];

        return inertia('Business/Management/Dashboard', $data);
    }
}