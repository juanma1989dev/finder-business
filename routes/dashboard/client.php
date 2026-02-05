<?php

use App\Http\Controllers\Dashboard\Client\IndexController;
use Illuminate\Support\Facades\Route; 

Route::middleware(['auth', 'verified', 'account.configured'])->prefix('dashboard/client')->name('dashboard.')->group(function () { 
    Route::get('/', [IndexController::class, 'index'])->name('client.dashboard');
});

 