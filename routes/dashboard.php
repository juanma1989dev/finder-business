<?php

use App\Http\Controllers\Dashboard\Business\GalleryController;
use App\Http\Controllers\Dashboard\Business\InfoGeneralController;
use App\Http\Controllers\Dashboard\Business\ProductsController;
use App\Http\Controllers\Dashboard\Business\SocialNetworksController;  

use App\Http\Controllers\Dashboard\Business\BusinessController;
use App\Http\Controllers\Dashboard\Business\LocationController;
use App\Http\Controllers\Dashboard\IndexController; 
use Illuminate\Support\Facades\Route; 

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', [IndexController::class, 'index'])->name('dashboard'); // PEDING

    // Route::get('/dashboard/profile/business', [BusinessController::class, 'index'])->name('dashboard.business');
    // Route::get('/dashboard/business/create', [BusinessController::class, 'create'])->name('dashboard.business.create');
    // Route::post('/dashboard/business/create', [BusinessController::class, 'store'])->name('dashboard.business.store');

    
    
    Route::post('/dashboard/business/update-cover-image/{idBusiness}', [BusinessController::class, 'updateCoverImage']);
    Route::resource('/dashboard/business', BusinessController ::class);

    #  Rutas para adminsitra los negocios
    Route::prefix('/dashboard/business/{business}')->name('dashboard.business.')
    ->group(function () {
        Route::resource('info-general', InfoGeneralController::class);
        Route::resource('location', LocationController::class);
        Route::resource('services', ProductsController::class);
        Route::post('services/{service}', [ProductsController::class, 'update'])
            ->name('services.update-post');
        Route::resource('gallery', GalleryController::class);
        Route::resource('social-networks', SocialNetworksController::class);
    });

    // /******************************* */
    // Route::get('/dashboard/profile/business/confirm-code', [BusinessController::class, 'codes'])->name('dashboard.business.codes');
    // Route::post('/dashboard/profile/business/validate-code', [BusinessController::class, 'codeValidate'])->name('dashboard.business.code.validate');
    // Route::post('/dashboard/profile/business/code-to-create', [BusinessController::class, 'codeCreate'])->name('dashboard.business.code.create');
});