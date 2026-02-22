<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Domains\Users\Services\GoogleAuthService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleController extends Controller
{
    public function __construct(
        private GoogleAuthService $googleAuthService
    ) {
    }

    /**
     * Redirige al usuario a Google para login
     */
    public function redirectToGoogleLogin(): RedirectResponse
    {
        // dd('---> LOGIN');
        $this->googleAuthService->setAuthAction('login');
        return Socialite::driver('google')->redirect();
    }

    /**
     * Redirige al usuario a Google para registro
     */
    public function redirectToGoogleRegister(): RedirectResponse
    {
       # Validar que el usuario haya aceptado el aviso
        if (!session('accept_privacy', false)) {
            return redirect()
                ->route('register')
                ->with('error', 'Debes aceptar el Aviso de Privacidad para continuar.');
        }

        # Guardar el  registro
        $this->googleAuthService->setAuthAction('register');

        # Redirigir a Google
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

            $userLogged = Auth::user();

            if(!$userLogged->type || empty($userLogged->type)){
                return redirect()->route('account.config.home');
            }

            # Redirect en caso de registro
            if (isset($result['message'])) {
                return redirect()->route($result['redirect'])->with('success', $result['message']);
            }

            return redirect()->route($result['redirect']);

        } catch (Exception $e) {

            $this->googleAuthService->clearAuthAction();
            
            return redirect()->back()
                ->with('error', 'Error al autenticar con Google. Por favor intenta nuevamente.');
        }
    }
}