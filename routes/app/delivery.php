<?php

use App\Http\Controllers\Dashboard\Delivery\IndexController;
use App\Http\Controllers\Dashboard\Delivery\OrderController;
use App\Http\Controllers\Public\Delivery\IndexController as DeliveryIndexController;
use App\Http\Controllers\Public\Delivery\LocationController;
use App\Http\Controllers\Public\DeliveryContoller as PublicDeliveryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Delivery Domain Routes
|--------------------------------------------------------------------------
*/

# Delivery Dashboard
Route::middleware(['auth', 'verified', 'account.configured', 'delivery'])->prefix('dashboard/delivery')->name('dashboard.')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('delivery.dashboard');
});

# Delivery Fulfillment
Route::middleware(['auth', 'verified', 'delivery'])->prefix('/delivery')->group(function () {
    Route::get('/', [DeliveryIndexController::class, 'index'])->name('delivery.home');

    Route::get('/orders/available', [OrderController::class, 'available'])->name('delivery.orders.available');
    Route::post('/orders/{order}/accept', [OrderController::class, 'accept'])->name('delivery.orders.accept');
    Route::post('/orders/{order}/on-the-way', [OrderController::class, 'onTheWay'])->name('delivery.orders.onTheWay');
    Route::post('/orders/{order}/delivered', [OrderController::class, 'delivered'])->name('delivery.orders.delivered');

    Route::post('/location-store', [LocationController::class, 'update'])->name('delivery.location.update');
    Route::get('/orders/{order}/location', [LocationController::class, 'getLocation'])->name('delivery.location.location');
});

# Availability (from public)
Route::patch('/delivery/availability', [PublicDeliveryController::class, 'availability'])->name('delivery.availability');
