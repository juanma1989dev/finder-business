<?php

namespace App\Http\Controllers\Public;

use App\Domains\Orders\Actions\CreateOrderAction;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShoppingCartController extends Controller
{
    public function index()
    {
        return inertia('public/ShoppingCart/DetailsPage');
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