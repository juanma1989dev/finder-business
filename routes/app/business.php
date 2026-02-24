<?php

use App\Http\Controllers\App\Business\IndexController;

use App\Http\Controllers\App\Business\OrdersDeltaController as BusinessOrdersDeltaController;
use App\Http\Controllers\App\Business\OrderManagementController;  
use Illuminate\Support\Facades\Route; 

#
use App\Http\Controllers\App\Business\Management\DashboardController; 
use App\Http\Controllers\App\Business\Management\InfoGeneralController;
use App\Http\Controllers\App\Business\Management\LocationController;
use App\Http\Controllers\App\Business\Management\ProductsController;
use App\Http\Controllers\App\Business\Management\GalleryController;
use App\Http\Controllers\App\Business\Management\SocialNetworksController;
use App\Http\Controllers\App\Business\Management\AvailabilityController;
/*
|--------------------------------------------------------------------------
| Business Domain Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'account.configured'])->prefix('dashboard')->name('dashboard.')->group(function () { 
    Route::middleware('business')->group(function () {
        # Business
        Route::resource('/business', IndexController::class)->only(['index', 'store', 'update']);

        # Business basic config // *** Despues se puede mover a la seccion de gestion del negocio ****
        Route::prefix('business/{business}')->as('business.')->group(function () {
            Route::patch('opening-hours', [AvailabilityController::class, 'update'])->name('opening.update');
        }); 

        # Gestion
        Route::prefix('business/{business}-{slug}')->name('business.')->group(function () {
            Route::get('/home', [DashboardController::class, 'index'])->name('business.dashboard');

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
