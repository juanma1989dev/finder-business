<?php

namespace App\Http\Controllers\Auth\Client;

use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return inertia('auth/client/register', [
            'typeUser' => UserTypeEnum::CLIENT,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request, \App\Domains\Users\Actions\RegisterUserAction $registerUserAction, \App\Domains\Users\Actions\LoginUserAction $loginUserAction): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $registerUserAction->execute([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        event(new Registered($user));

        $loginUserAction->execute($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
