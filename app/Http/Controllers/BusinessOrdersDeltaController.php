<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Symfony\Component\HttpFoundation\Request;

class BusinessOrdersDeltaController extends Controller
{
    public function delta(Request $request)
    {
        // $since = $request->query('since');

        $orders = Order::with(['user'])->get();

        return response()->json([
            'orders' => $orders
        ]);   // solo los pedido de este negocio y que aun no  han sido mostrados 
    }
}