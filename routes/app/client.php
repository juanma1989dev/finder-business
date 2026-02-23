<?php

use App\Http\Controllers\Dashboard\Client\IndexController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\AccountConfigController;
use App\Http\Controllers\Public\BusinessController;
use App\Http\Controllers\Public\ShoppingCartController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Public\Client\OrderController;
use App\Http\Controllers\Public\Client\OrderStatusController;
use App\Http\Controllers\FcmTokenController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Cliente Domain Routes
|--------------------------------------------------------------------------
*/

# Dashboard & Account Config
Route::middleware(['auth', 'verified'])->group(function () {
    # Account Configuration
    Route::prefix('dashboard/account-config')->name('account.config.')->group(function () {
        Route::get('/', [AccountConfigController::class, 'index'])->name('home');
        Route::post('/', [AccountConfigController::class, 'store'])->name('store');
    });

    # Client Dashboard
    Route::middleware('account.configured')->prefix('dashboard/client')->name('dashboard.')->group(function () { 
        Route::get('/', [IndexController::class, 'index'])->name('client.dashboard');
    });
    
    # FCM Token
    Route::post('/fcm/token', [FcmTokenController::class, 'store']);
});

# Settings
Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

# Shopping & Orders (Public-facing Client actions)
Route::get('/favorites', [BusinessController::class, 'favorites'])->name('public.favorites');
Route::post('/business/detail/set-favorite', [BusinessController::class, 'setFavorite']);

Route::prefix('/shopping-cart')->group(function() {
    Route::post('/', [ShoppingCartController::class, 'create'])->name('shopping.cart.create');
    Route::get('/details', [ShoppingCartController::class, 'index'])->name('shopping.cart.details');
    Route::get('/{id}', [ShoppingCartController::class, 'show'])->name('shopping.cart.show');
});

Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{key}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{key}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/orders/{order}/status', [OrderStatusController::class, 'show'])->middleware('auth');
Route::get('/orders/{order}', [ OrderController::class, 'show' ]);
