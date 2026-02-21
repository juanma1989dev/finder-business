<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeliveryContoller extends Controller
{
    public function availability(Request $request)
    {

        $request->validate([
            'status' => ['required', 'boolean'],
        ]);

        try {
            $user = Auth::user();

            if (! $user || ! $user->deliveryProfile) {
                abort(403);
            }
            
            $profile = $user->deliveryProfile;
            
            if (!$profile->is_active) {
                abort(403);
            }


            $status = $profile->status()->firstOrCreate([]);

            $availability = $request->boolean('status');

            $status->update([
                'is_available'       => $availability,
                'last_available_at'  => $availability ? now() : null,
            ]);

            return back()->with('success', 'Disponibilidad actualizada.');
        } catch (\Throwable $e) {
            report($e);

            return back()->withErrors([
                'general' => 'Error al actualizar la disponibilidad.',
            ]);
        }
    }
}