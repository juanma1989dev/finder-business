<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Businesses;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{   
    public function index(Request $request)
    {
        $businesses = Businesses::where('user_id', Auth::id())->first();
        $orders = Order::all(); // Pendiente de filtrar;

        $data = [
           'orders' => $orders,
           'business' => $businesses,
        ];

        return inertia('dashboard/business/Index', $data);
    }
}