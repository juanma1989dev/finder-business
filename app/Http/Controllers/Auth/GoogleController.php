<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\GoogleAuthService;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleController extends Controller
{
    public function __construct(
        private GoogleAuthService $googleAuthService
    ) {}

    /**
     * Redirige al usuario a Google para login
     */
    public function redirectToGoogleLogin(): RedirectResponse
    {
        $this->googleAuthService->setAuthAction('login');
        return Socialite::driver('google')->redirect();
    }

    /**
     * Redirige al usuario a Google para registro
     */
    public function redirectToGoogleRegister(): RedirectResponse
    {
        $this->googleAuthService->setAuthAction('register');
        return Socialite::driver('google')->redirect();
    }

    /**
     * Maneja el callback de Google OAuth
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $action = $this->googleAuthService->getAndForgetAuthAction();
            
            $result = $this->googleAuthService->handleGoogleAuthentication($googleUser, $action);

            if (!$result['success']) {
                return redirect()
                    ->route($result['redirect'])
                    ->with('error', $result['error']);
            }

            $redirect = redirect()->route($result['redirect']);
            
            if (isset($result['message'])) {
                $redirect->with('success', $result['message']);
            }

            return $redirect;

        } catch (Throwable $e) {
            $this->googleAuthService->clearAuthAction();
            
            return redirect()
                ->route('login')
                ->with('error', 'Error al autenticar con Google. Por favor intenta nuevamente.');
        }
    }
}