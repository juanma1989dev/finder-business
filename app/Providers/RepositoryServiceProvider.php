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

# Repositorios
use App\Repositories\Laravel\BusinessCategoryRepository;
use App\Repositories\Laravel\BusinessRepository;
use App\Repositories\Laravel\FavoriteBusinessRepository;
use App\Repositories\Laravel\AmenitiesRepository;
use App\Repositories\Laravel\GalleryRepository;
use App\Repositories\Laravel\PaymentsRepository;

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
    }
} 