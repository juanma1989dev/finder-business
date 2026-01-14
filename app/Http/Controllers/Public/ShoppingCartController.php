<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShoppingCartController extends Controller
{
    public function index()
    {
        return inertia('public/ShoppingCart/Details');
    }

    public function create(Request $request)
    {
        $data = $request->all();

        return redirect()->back()->with('success', $data);
    }
}