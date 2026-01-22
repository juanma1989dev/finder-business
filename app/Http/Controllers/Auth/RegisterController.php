<?php 

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
  public function index(SessionManagement $sessionManagement, Request $request)
    {
        $typeAccount = $request->get('type');

        $conf = $sessionManagement->validateTypeAccount($typeAccount);

        $data = [
            "registerConfig" => $conf
        ];

        return inertia('auth/RegisterPage', $data);
    }
}