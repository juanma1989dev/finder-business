<?php

namespace App\Http\Controllers\Public;

use App\Actions\Orders\CreateOrderAction;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class ShoppingCartController extends Controller
{
    public function index()
    {
        return inertia('public/ShoppingCart/Details');
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
        $order = Order::findOrFail($orderId);
        
        $order->load('items.extras', 'items.variations');

        $data = [
            'order' => $order
        ];

        return inertia('public/ShoppingCart/OrderPage', $data);
    }
}