<?php 

require __DIR__.'/business.php';
require __DIR__.'/delivery.php';
require __DIR__.'/client.php';

use App\Http\Controllers\AccountConfigController;
use Illuminate\Support\Facades\Route; 

Route::middleware(['auth', 'verified'])->prefix('dashboard/account-config')->name('account.config.')->group(function () {
    Route::get('/', [AccountConfigController::class, 'index'])->name('home');
    Route::post('/', [AccountConfigController::class, 'store'])->name('store');
});

 