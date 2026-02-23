<?php

use App\Http\Controllers\Public\BusinessController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [BusinessController::class, 'index'])->name('public.home');
Route::get('/business/{slug}/{id}', [BusinessController::class, 'details'])->name('public.business.detail');

# Auth Routes
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::resource('/register', RegisterController::class);

# Google Auth
Route::get('/auth/google/login', [GoogleController::class, 'redirectToGoogleLogin'])->name('auth.google.login');
Route::get('/auth/google/register', [GoogleController::class, 'redirectToGoogleRegister'])->name('auth.google.register');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

# Privacy
Route::post('/session/privacy-accept', function (Request $request) {
    session([
        'accept_privacy' => true,
        'privacy_version' => config('privacy.version'),
    ]);
    return redirect()->back();
})->name('privacy.accept');
