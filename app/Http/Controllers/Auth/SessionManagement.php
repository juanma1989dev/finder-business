<?php 

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

class SessionManagement
{
    public function validateTypeAccount(?string $typeAccount = null) {
        $configData = config('login');
        $config     = $configData[$typeAccount] ?? null;

        if(is_null($config)) {

            // dd(7989);

            return redirect()
                ->route('accounts')
                ->with('error', 'Tipo de cuenta no válida.');
        }

        return  $config;
    }

}