<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeliveryContoller extends Controller
{
    public function availability(Request $request)
    {
        try {
            $availability = $request->boolean('status');

            $user = User::findOrFail(Auth::id());

            if ($user->type !== 'delivery') {
                abort(403);
            }

            $user->update([
                'is_available' => $availability,
                'last_available_at' => $availability ? now() : null,
            ]);

            return back()->with('success', 'Disponibilidad actualizada.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'general' => 'Error al actualizar la disponibilidad.'
            ]);
        }
    }
}