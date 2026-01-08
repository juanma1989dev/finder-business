<?php

namespace App\Http\Controllers\Auth\Business;

use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function index(Request $request)
    {
        return inertia('auth/business/register', [
            // 'canResetPassword' => Route::has('password.request'),
            'typeUser' => UserTypeEnum::BUSINESS,
            'status' => $request->session()->get('status'),
        ]);
    }
}
