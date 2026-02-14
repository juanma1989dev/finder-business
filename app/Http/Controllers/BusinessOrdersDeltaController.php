<?php

namespace App\Http\Controllers;

use App\Models\Businesses;
use Illuminate\Http\Request;

class BusinessOrdersDeltaController extends Controller
{
    public function delta(Request $request)
    {
        $user = $request->user();

        $business = Businesses::where('user_id', $user->id)->first();

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
