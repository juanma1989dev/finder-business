<?php

namespace App\Http\Controllers\App\Client;

use App\Domains\Orders\Actions\CreateOrderAction;
use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShoppingCartController extends Controller
{
    public function index()
    {
        return inertia('Client/ShoppingCart/DetailsPage');
    }

    public function create(Request $request, CreateOrderAction $action)
    {
        $data = $request->all();

        $order = $action->execute(
            items: $data['items'],
            userId: $request->user()->id
        );

        return redirect()
            ->route('shopping.cart.show', $order->id)
            ->with('success', 'Orden creada con éxito');
    }

    public function show(int $orderId)
    {
        $order = Order::query()
            ->with(['items.extras', 'items.variations'])
            ->where('id', $orderId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$order) {
            abort(404, 'Orden no encontrada');
        }
        
        $data = [
            'order' => $order,
            'statusLabel' => OrderStatusEnum::labels()[$order->status] ?? $order->status,
        ];

        return inertia('Client/ShoppingCart/OrderPage', $data);
    }
}