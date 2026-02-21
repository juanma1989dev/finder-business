<?php

require __DIR__.'/dashboard/index.php';
require __DIR__.'/public.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/delivery.php';

use App\Http\Controllers\FcmTokenController;
use Illuminate\Support\Facades\Route;

Route::post('/fcm/token', [FcmTokenController::class, 'store'])->middleware('auth');