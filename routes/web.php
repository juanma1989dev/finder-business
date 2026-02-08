<?php


require __DIR__.'/dashboard/index.php';

require __DIR__.'/public.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/delivery.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; 


Route::post('/fcm/token', function (Request $request) {
    $request->validate([
        'token' => 'required|string',
    ]);

    $request->user()->update([
        'fcm_token' => $request->token,
    ]);

    return response()->json(['ok' => true]);
})->middleware('auth');