<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;

class ShoppingCartController extends Controller
{
    public function index()
    {
        return inertia('public/ShoppingCart/Details');
    }
}