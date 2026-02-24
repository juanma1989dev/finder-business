<?php

namespace App\Http\Controllers\App\Business;

use App\Domains\Businesses\Models\Business;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrdersDeltaController extends Controller
{
    public function delta(Request $request)
    {
        $business = Business::where('user_id', Auth::id())->first();

        if (!$business) {
            return response()->json([
                'orders' => []
            ]);
        }

        $since = $request->query('since');
        $orderId = $request->query('orderId');

        $orders = $business->orders()
            ->when($orderId, function ($query) use ($orderId) {
                $query->where('id', $orderId);
            })
            ->with(['items', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }
}
