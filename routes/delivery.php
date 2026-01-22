<?php

use App\Http\Controllers\Dashboard\Delivery\IndexController;
use App\Http\Controllers\Dashboard\Delivery\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'delivery'])->prefix('/delivery')->group(function () {
    Route::get('', [IndexController::class, 'index'])->name('delivery.dashboard');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('delivery.orders.updateStatus');
});
