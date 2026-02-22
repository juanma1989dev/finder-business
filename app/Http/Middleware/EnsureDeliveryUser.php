<?php

namespace App\Http\Middleware;

use App\Domains\Users\Enums\UserTypeEnum;
use Closure;
use Illuminate\Http\Request;

class EnsureDeliveryUser
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $user->type !== UserTypeEnum::DELIVERY->value) {
            return redirect('/');
        }
        
        return $next($request);
    }
}
