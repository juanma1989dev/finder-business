<?php

use App\Http\Controllers\BusinessOrdersDeltaController;
use App\Http\Controllers\Dashboard\Business\GalleryController;
use App\Http\Controllers\Dashboard\Business\InfoGeneralController;
use App\Http\Controllers\Dashboard\Business\ProductsController;
use App\Http\Controllers\Dashboard\Business\SocialNetworksController;
use App\Http\Controllers\OrderManagementController;  
use App\Http\Controllers\Dashboard\Business\BusinessController;
use App\Http\Controllers\Dashboard\Business\BusinessOpeningController;
use App\Http\Controllers\Dashboard\Business\LocationController;
use App\Http\Controllers\Dashboard\IndexController; 
use Illuminate\Support\Facades\Route; 

/*
|--------------------------------------------------------------------------
| Business Domain Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'account.configured'])->prefix('dashboard')->name('dashboard.')->group(function () { 
    Route::middleware('business')->group(function () {
        # Dashboard home
        Route::resource('/business', BusinessController::class)->only(['index', 'store', 'update']);

        # Business basic config
        Route::prefix('business/{business}')->as('business.')->group(function () {
            Route::patch('opening-hours', [BusinessOpeningController::class, 'update'])->name('opening.update');
        });

        # Secciones
        Route::prefix('business/{business}-{slug}')->name('business.')->group(function () {
            Route::get('/home', [IndexController::class, 'index'])->name('business.dashboard');

            Route::get('info-general', [InfoGeneralController::class, 'edit'])->name('info-general.edit');
            Route::put('info-general', [InfoGeneralController::class, 'update'])->name('info-general.update');

            Route::get('location', [LocationController::class, 'edit'])->name('location.edit');
            Route::put('location', [LocationController::class, 'update'])->name('location.update');

            Route::resource('services', ProductsController::class)->only(['index', 'store', 'destroy']);
            Route::post('services/{service}', [ProductsController::class, 'update'])->name('services.update-post');

            Route::resource('gallery', GalleryController::class)->only(['index', 'store', 'destroy']);

            Route::get('social-networks', [SocialNetworksController::class, 'edit'])->name('social.edit');
            Route::put('social-networks', [SocialNetworksController::class, 'update'])->name('social.update');
        });

        # Ordenes
        Route::get('orders/delta', [BusinessOrdersDeltaController::class, 'delta']);
        Route::resource('orders', OrderManagementController::class)->only(['index', 'show']);
        Route::patch('orders/{order}/status', [OrderManagementController::class, 'updateStatus'])->name('orders.status');
    });
});
