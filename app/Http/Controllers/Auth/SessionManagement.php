<?php 

namespace App\Http\Controllers\Auth;

class SessionManagement
{
    public function validateTypeAccount(?string $typeAccount = null) {
        $configData = config('login');
        $config     = $configData[$typeAccount] ?? null;

        if(is_null($config)) {
            return redirect()
                ->route('accounts')
                ->with('error', 'Tipo de cuenta no válida.');
        }

        return  $config;
    }

}