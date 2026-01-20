<?php 

namespace App\Http\Controllers\Auth;

use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;

class AccountsController extends Controller
{
    public function index()
    {
        $accountTypes = config("login"); 

        return inertia('auth/accounts', [
            'accountTypes' => $accountTypes
        ]);
    }
}
