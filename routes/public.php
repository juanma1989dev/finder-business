<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\BusinessController;
use App\Http\Controllers\Public\ShoppingCartController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Public\DeliveryContoller;

Route::get('/', [BusinessController::class, 'index'])->name('public.home');
Route::get('/favorites', [BusinessController::class, 'favorites'])->name('public.favorites');
Route::post('/business/detail/set-favorite', [BusinessController::class, 'setFavorite']);
Route::get('/business/detail/{id}', [BusinessController::class, 'details'])->name('public.business.detail');




Route::prefix('/shopping-cart')->group(function() {
    Route::get('/details', [ShoppingCartController::class, 'index'])->name('shopping.cart.details'); // change for show
    Route::post('/', [ShoppingCartController::class, 'create'])->name('shopping.cart.create');
    Route::get('/{id}', [ShoppingCartController::class, 'show'])->name('shopping.cart.show');
});

Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{key}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{key}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::patch('/delivery/availability', [DeliveryContoller::class, 'availability'])->name('delivery.availability');
