<?php

namespace App\Services\Auth;

use App\Domains\Users\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class GoogleAuthService
{
    private const ACTION_LOGIN = 'login';
    private const ACTION_REGISTER = 'register';
    private const SESSION_KEY = 'google_auth_action';

    /**
     * Guarda la acción de autenticación en sesión
     */
    public function setAuthAction(string $action): void
    {
        Session::put(self::SESSION_KEY, $action);
    }

    /**
     * Obtiene y elimina la acción de autenticación de la sesión
     */
    public function getAndForgetAuthAction(): string
    {
        $action = Session::get(self::SESSION_KEY, self::ACTION_LOGIN);
        Session::forget(self::SESSION_KEY);
        return $action;
    }

    /**
     * Limpia la acción de autenticación de la sesión
     */
    public function clearAuthAction(): void
    {
        Session::forget(self::SESSION_KEY);
    }

    /**
     * Busca un usuario existente por email o google_id
     */
    public function findExistingUser(SocialiteUser $googleUser): ?User
    {
        return User::where('email', $googleUser->getEmail())
            ->orWhere('google_id', $googleUser->getId())
            ->first();
    }

    /**
     * Crea un nuevo usuario desde los datos de Google
     */
    /**
     * Crea un nuevo usuario desde los datos de Google
     */
    public function createUserFromGoogle(SocialiteUser $googleUser): User
    {
        $action = new \App\Domains\Users\Actions\RegisterUserAction();
        
        return $action->execute([
            'name'                => $googleUser->getName(),
            'email'               => $googleUser->getEmail(),
            'type'                => null, 
            'google_id'           => $googleUser->getId(),
            'password'            => Str::random(16),
            'privacy_accepted'    => true,
            'privacy_version'     => config('privacy.version'),
            'privacy_accepted_at' => now(),
            'email_verified_at'   => now(),
        ]);
    }

    /**
     * Actualiza el google_id de un usuario existente si no lo tiene
     */
    public function syncGoogleId(User $user, string $googleId): void
    {
        if (!$user->google_id) {
            $user->update(['google_id' => $googleId]);
        }
    }

    /**
     * Autentica al usuario en la aplicación
     */
    /**
     * Autentica al usuario en la aplicación
     */
    public function loginUser(User $user): void
    {
        $action = new \App\Domains\Users\Actions\LoginUserAction();
        $action->execute($user, true);
    }

    /**
     * Maneja el proceso completo de autenticación con Google
     * 
     * @return array{success: bool, user: ?User, error: ?string, redirect: string}
     */
    public function handleGoogleAuthentication(SocialiteUser $googleUser, string $action): array
    {

        $existingUser = $this->findExistingUser($googleUser);


        # Caso 1: Intentando registrarse pero ya existe
        if ($action === self::ACTION_REGISTER && $existingUser) {
            return [
                'success' => false,
                'user' => null,
                'error' => 'Ya existe una cuenta con este correo. Por favor inicia sesión.',
                'redirect' => 'login.index'  
            ];
        }


        # Caso 2: Intentando login pero no existe
        if ($action === self::ACTION_LOGIN && !$existingUser) {
            return [
                'success' => false,
                'user' => null,
                'error' => 'No existe una cuenta con este correo. Por favor regístrate primero.',
                'redirect' => 'register.index' 
            ];
        }


        $configLogin = config('login');
        $URL_HOME = 'public.home';


        # Caso 3: Registro exitoso
        if ($action === self::ACTION_REGISTER && !$existingUser) {
            $user = $this->createUserFromGoogle($googleUser);
            
            $this->loginUser($user);

            $conf = $this->getConfigLogin( $configLogin);

            $urlRedirect = $conf['route.start'] ?? $URL_HOME;

            return [
                'success' => true,
                'user' => $user,
                'error' => null,
                'redirect' => $urlRedirect,  
                'message' => '¡Cuenta creada exitosamente!'
            ];
        } 

        # Caso 4: Login exitoso
        $this->syncGoogleId($existingUser, $googleUser->getId());
        $this->loginUser($existingUser);

        $conf = $this->getConfigLogin( $configLogin);
        $urlRedirect = $conf['route.start'] ?? $URL_HOME;

        return [
            'success' => true,
            'user' => $existingUser,
            'error' => null,
            'redirect' =>  $urlRedirect
        ];
    }

    private function getConfigLogin(array $configLogin = [])
    {
        $userLogged = Auth::user();

        $userType = $userLogged->type ?? null;

        $conf = $configLogin[ $userType ] ?? [];

        return $conf;
    }
}