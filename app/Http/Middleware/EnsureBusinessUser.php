<?php 

namespace App\Http\Middleware;

use App\Domains\Users\Enums\UserTypeEnum;
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

        if (!$user || $user->type !== UserTypeEnum::BUSINESS->value) {
            return redirect()->route('dashboard')->with('error', 'No tienes permiso para acceder a esta sección.'); 
        }

        return $next($request);
    }
}