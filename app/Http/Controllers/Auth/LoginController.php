<?php 

namespace App\Http\Controllers\Auth;

use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function index(Request $request)
    {
        $loginConfig = config('login');
        $loginType = $request->get('type');
        $loginTypeConfig = $loginConfig[$loginType];

        $data = [
            "loginConfig" => $loginTypeConfig
        ];

        return inertia('auth/LoginPage', $data);
    }
}