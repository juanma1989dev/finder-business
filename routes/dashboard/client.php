<?php

use App\Http\Controllers\Dashboard\Client\IndexController;
use Illuminate\Support\Facades\Route; 

Route::middleware(['auth', 'verified'])->prefix('dashboard/client')->name('dashboard.')->group(function () { //dashboard
    Route::get('/', [IndexController::class, 'index'])->name('client.dashboard');
});

 