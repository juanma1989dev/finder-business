<?php

use App\Http\Controllers\Dashboard\Delivery\IndexController as DashboardIndexController;
use App\Http\Controllers\Dashboard\Delivery\OrderController;

use App\Http\Controllers\Public\Delivery\IndexController as DeliveryIndexController;
use App\Http\Controllers\Public\Delivery\LocationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'delivery'])->prefix('/delivery')->group(function () {

    Route::get('', [DeliveryIndexController::class, 'index'])->name('delivery.home');

    // Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('delivery.orders.updateStatus');

    Route::get('/orders/available', [OrderController::class, 'available'])->name('delivery.orders.available');
    Route::post('/orders/{order}/accept', [OrderController::class, 'accept'])->name('delivery.orders.accept');
    Route::post('/orders/{order}/on-the-way', [ OrderController::class,'onTheWay',])->name('delivery.orders.onTheWay');
    Route::post('/orders/{order}/delivered', [OrderController::class, 'delivered' ])->name('delivery.orders.delivered');

    Route::post('/location-store', [ LocationController::class, 'update'])->name('delivery.location.update');
    Route::get('/orders/{order}/location', [ LocationController::class, 'getLocation'])->name('delivery.location.location'); //// ESTA DEBERIA SER LA RUTA
});
