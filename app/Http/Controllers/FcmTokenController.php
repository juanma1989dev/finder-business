<?php

namespace App\Http\Controllers;

use App\Models\FcmToken;
use Illuminate\Http\Request;

class FcmTokenController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'token'  => 'required|string',
            'device' => 'nullable|string',
        ]);

        $user = $request->user();

        $token = FcmToken::updateOrCreate(
            ['token' => $data['token']],
            [
                'user_id'   => $user->id,
                'device'    => $data['device'] ?? null,
                'is_active' => true,
            ]
        );

        return response()->json([
            'ok'      => true,
            'created' => $token->wasRecentlyCreated,
        ]);
    }
}
