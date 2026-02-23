<?php

use App\Http\Controllers\App\Public\BusinessController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BusinessController::class, 'index'])->name('public.home');
Route::get('/business/{slug}/{id}', [BusinessController::class, 'details'])->name('public.business.detail');
