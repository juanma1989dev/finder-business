<?php 

namespace App\Http\Middleware;

use App\Enums\UserTypeEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBusinessUser
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Verificamos si no hay usuario o si el tipo no es BUSINESS
        if (!$user || $user->type !== UserTypeEnum::BUSINESS) {
            return redirect()->route('dashboard')->with('error', 'No tienes permiso para acceder a esta sección.'); 
        }

        return $next($request);
    }
}