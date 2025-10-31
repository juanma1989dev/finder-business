<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Throwable;

class GoogleController extends Controller
{
    public function redirectToGoogleLogin()
    {
        Session::put('google_auth_action', 'login');
        return Socialite::driver('google')->redirect();
    }

    public function redirectToGoogleRegister()
    {
        Session::put('google_auth_action', 'register');
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $action = Session::get('google_auth_action', 'login');
            Session::forget('google_auth_action');  
            
            $existingUser = User::where('email', $googleUser->getEmail())
                ->orWhere('google_id', $googleUser->getId())
                ->first();

           
            # Intentando REGISTRARSE pero ya existe
            if ($action === 'register' && $existingUser) {
                return redirect()->route('register')
                    ->with('error', 'Ya existe una cuenta con este correo. Por favor inicia sesión.');
            }

            # Intentando LOGIN pero no existe
            if ($action === 'login' && !$existingUser) {
                return redirect()->route('login')
                    ->with('error', 'No existe una cuenta con este correo. Por favor regístrate primero.');
            }

            # CASO 3: REGISTRO exitoso
            if ($action === 'register' && !$existingUser) {
                $user = User::create([
                    'name'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password'  => bcrypt(Str::random(16)),
                ]);
                
                Auth::login($user, true);
                return redirect()->route('public.home')
                    ->with('success', '¡Cuenta creada exitosamente!');
            }

            # CASO 4: LOGIN exitoso (actualizar google_id si no lo tenía)
            if (!$existingUser->google_id) {
                $existingUser->update(['google_id' => $googleUser->getId()]);
            }

            Auth::login($existingUser, true);
            return redirect()->route('public.home');

        } catch (Throwable $e) {
            // Log::error('Google auth failed', ['error' => $e->getMessage()]);
            Session::forget('google_auth_action');
            return redirect()->route('login')
                ->with('error', 'Error al autenticar con Google');
        }
    }
}