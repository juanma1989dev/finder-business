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
 
        $data = [
            'business' => fn () => Businesses::where('user_id', $user->id)->first(),
            'orders' => fn () => Businesses::where('user_id', $user->id)
                ->first()
                ?->orders()
                ->whereNotIn('status', OrderStatusEnum::finalStatuses())
                ->with(['items', 'user'])
                ->latest()
                ->get(),
        ];

        return inertia('dashboard/business/Index', $data);
    }

    public function refresh()
    {
        
    }
}