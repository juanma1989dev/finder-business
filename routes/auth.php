<?php

use App\Enums\UserTypeEnum;
use App\Http\Controllers\Auth\AccountsController;
use App\Http\Controllers\Auth\Business\LoginController;
use App\Http\Controllers\Auth\Business\RegisterController;
use App\Http\Controllers\Auth\Client\AuthenticatedSessionController;
use App\Http\Controllers\Auth\Client\RegisteredUserController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController as AuthLoginController; ///
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/accounts', [AccountsController::class, 'index'])->name('accounts');

Route::middleware('guest')->prefix('/login')->group(function () {
    Route::resource('', AuthLoginController::class) ;
});
# Rutas del cliente
Route::middleware('guest')->prefix('client')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('client.register');
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('client.login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('client.login.store');
});

#Rutas del negocio
Route::middleware('guest')->prefix('business')->group(function () {
    Route::get('/login', [LoginController::class, 'index'])->name('business.register');
    Route::get('/register', [RegisterController::class, 'index'])->name('business.login');
    // Route::post('/business/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

# Rutas Google
Route::get('/auth/google/login', [GoogleController::class, 'redirectToGoogleLogin'])->name('auth.google.login');
Route::get('/auth/google/register', [GoogleController::class, 'redirectToGoogleRegister'])->name('auth.google.register');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

Route::post('/session/privacy-accept', function (Request $request) {
    session([
        'type_user' => $request->input('typeUser'),
        'accept_privacy' => true,
        'privacy_version' => config('privacy.version'),
    ]);
    return redirect()->back();
})->name('privacy.accept');