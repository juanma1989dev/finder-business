<?php

namespace  App\Providers;

use App\Domains\Businesses\Repositories\Eloquent\AmenitiesRepository;
use App\Domains\Businesses\Repositories\Eloquent\BusinessCategoryRepository;
use App\Domains\Businesses\Repositories\Eloquent\FavoriteBusinessRepository;
use App\Domains\Businesses\Repositories\Eloquent\GalleryRepository;
use App\Domains\Businesses\Repositories\Eloquent\PaymentsRepository;
use App\Domains\Businesses\Repositories\Eloquent\ProductCategoryRepository;
use App\Domains\Businesses\Repositories\Eloquent\BusinessRepository;
use App\Domains\Businesses\Repositories\Contracts\AmenitiesRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\BusinessCategoryRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\FavoriteBusinessRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\GalleryRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\PaymentsRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\ProductCategoryRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\BusinessRepositoryInterface;
use App\Domains\Users\Repositories\Contracts\UserRepositoryInterface;
use App\Domains\Users\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

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