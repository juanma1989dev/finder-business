<?php

use App\Http\Controllers\Dashboard\Delivery\IndexController;

use Illuminate\Support\Facades\Route; 

Route::middleware(['auth', 'verified', 'account.configured', 'delivery', ])->prefix('dashboard/delivery')->name('dashboard.')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('delivery.dashboard');
});

 