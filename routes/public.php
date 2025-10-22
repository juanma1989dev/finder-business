<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\BusinessController;

Route::get('/', [BusinessController::class, 'index'])->name('public.home');
Route::get('/favorites', [BusinessController::class, 'favorites'])->name('public.favorites');
Route::post('/business/detail/set-favorite', [BusinessController::class, 'setFavorite']);
Route::get('/business/detail/{id}', [BusinessController::class, 'details'])->name('public.business.detail');
