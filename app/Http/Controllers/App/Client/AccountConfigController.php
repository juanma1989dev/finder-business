<?php 

namespace App\Http\Controllers\App\Client;

use App\Domains\Users\Enums\UserTypeEnum;
use App\Domains\Users\Models\DeliveryProfile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        
        return inertia('Client/AccountConfig', $data);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'account_type' => ['required', Rule::in( UserTypeEnum::cases() )],
        ]);

        $user = $request->user();

        if ($user->type) {
            abort(403, 'El tipo de cuenta ya fue definido.');
        }
        
        $this->processAccountType($user, $data);
        
        $config = config('login')[$user->type] ?? [];
        $urlRedirect = $config['route.start']  ?? 'public.home';

        return redirect()->route($urlRedirect);
    }

    private function processAccountType($user, array $data)
    {
        DB::transaction(function () use ($user, $data) {
            $user->update([
                'type' => $data['account_type'],
            ]);

            if ($data['account_type'] === UserTypeEnum::DELIVERY->value) {
                DeliveryProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    ['is_active' => true]
                );
            }
        });
    }
}