<?php

namespace  App\Providers;

use Illuminate\Support\ServiceProvider;

# Contratos
use App\Repositories\Contracts\BusinessCategoryRepositoryInterface;
use App\Repositories\Contracts\BusinessRepositoryInterface;
use App\Repositories\Contracts\FavoriteBusinessRepositoryInterface;
use App\Repositories\Contracts\AmenitiesRepositoryInterface;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use App\Repositories\Contracts\PaymentsRepositoryInterface;
use App\Repositories\Contracts\ProductCategoryRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;

# Repositorios
use App\Repositories\Laravel\BusinessCategoryRepository;
use App\Repositories\Laravel\BusinessRepository;
use App\Repositories\Laravel\FavoriteBusinessRepository;
use App\Repositories\Laravel\AmenitiesRepository;
use App\Repositories\Laravel\GalleryRepository;
use App\Repositories\Laravel\PaymentsRepository;
use App\Repositories\Laravel\ProductCategoryRepository;
use App\Repositories\Laravel\UserRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(BusinessRepositoryInterface::class, BusinessRepository::class);
        $this->app->bind(BusinessCategoryRepositoryInterface::class, BusinessCategoryRepository::class);
        $this->app->bind(FavoriteBusinessRepositoryInterface::class, FavoriteBusinessRepository::class);
        $this->app->bind(AmenitiesRepositoryInterface::class, AmenitiesRepository::class);
        $this->app->bind(GalleryRepositoryInterface::class, GalleryRepository::class);
        $this->app->bind(PaymentsRepositoryInterface::class, PaymentsRepository::class);
        $this->app->bind(ProductCategoryRepositoryInterface::class, ProductCategoryRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
} 