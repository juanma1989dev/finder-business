<?php 

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class AccountsController extends Controller
{
    public function index()
    {
        return inertia('auth/accounts', [
        ]);
    }
}
