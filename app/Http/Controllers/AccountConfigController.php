<?php 

namespace App\Http\Controllers;

use App\Enums\UserTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AccountConfigController extends Controller
{
    public function index() 
    {
        $config = config('login'); 

        $data = [
            'accountTypes'  => $config,
            'suggestedType' => UserTypeEnum::CLIENT->value
        ];
        
        return inertia('AccountConfig', $data);
    }

     public function store(Request $request)
    {
        $validated = $request->validate([
            'account_type' => ['required', Rule::in(['client', 'business', 'delivery'])],
        ]);

        $user = $request->user();

        if ($user->type) {
            abort(403, 'El tipo de cuenta ya fue definido.');
        }

        $user->update([
            'type' => $validated['account_type'],
        ]);

        $config = config('login')[$user->type] ?? [];
        $urlRedirect = $config['route.start']  ?? 'public.home';

        return redirect()->route($urlRedirect);
    }

}