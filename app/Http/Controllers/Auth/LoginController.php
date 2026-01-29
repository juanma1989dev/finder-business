<?php 

namespace App\Http\Controllers\Auth;
 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function index(SessionManagement $sessionManagement, Request $request)
    {
        $typeAccount = $request->get('type', 'client');

        $conf = $sessionManagement->validateTypeAccount($typeAccount);

        $data = [
            "loginConfig" => $conf
        ];

        return inertia('auth/LoginPage', $data);
    }

    // public function destroy(Request $request): RedirectResponse
    // {
    //     Auth::guard('web')->logout();

    //     $request->session()->invalidate();
    //     $request->session()->regenerateToken();

    //     return redirect('/');
    // }
}