<?php

namespace App\Http\Controllers\App\Business;

use App\Domains\Businesses\Models\Business;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrdersDeltaController extends Controller
{
    public function delta(Request $request)
    {
        $user = $request->user();

        $business = Business::where('user_id', $user->id)->first();

        if (!$business) {
            return response()->json([
                'orders' => []
            ]);
        }

        $since = $request->query('since');

        $orders = $business->orders()
            ->when($since, function ($query) use ($since) {
                $query->where('updated_at', '>', $since);
            })
            ->with(['items', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }
}
