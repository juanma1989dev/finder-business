<?php 

namespace App\Http\Controllers\App\Public\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function index(Request $request)
    {
         $data = [];

        return inertia('Public/Auth/Register', $data);
    }
}