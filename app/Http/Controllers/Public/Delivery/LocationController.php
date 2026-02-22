<?php

namespace App\Http\Controllers\Public\Delivery;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Users\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LocationController extends Controller
{
    public function update(Request $request)
    {
        $delivery = Auth::user();

        if ($delivery->type !== UserTypeEnum::DELIVERY->value) {
            return response()->json([], 403);
        }

        $order = Order::where('delivery_id', $delivery->id)
            ->where('status', OrderStatusEnum::ON_THE_WAY->value)
            ->first();

        if (!$order) {
            return response()->json([], 204);
        }

        $data = $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        // NEXT realtime
        cache()->put(
            "order_tracking_{$order->id}",
            [
                'lat' => $data['lat'],
                'lng' => $data['lng'],
                'updated_at' => now()->toISOString(),
            ],
            now()->addMinutes(2)
        );

        return response()->json([ 
            'ok' => true,
            'message' => 'Ubicación actualizada',
        ]);
    }

    public function getLocation(Order $order)
    {
        return response()->json(
            cache()->get("order_tracking_{$order->id}")
        );
    }
}