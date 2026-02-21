<?php

namespace App\Domains\Users\Actions;

use App\Domains\Users\Models\User;
use Illuminate\Support\Facades\Auth;

class LoginUserAction
{
    public function execute(User $user, bool $remember = false): void
    {
        Auth::login($user, $remember);
    }
}
