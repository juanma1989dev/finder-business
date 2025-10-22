<?php

namespace App\Services\Public;

use App\Mappers\BusinessMapper;
use App\Repositories\BusinessCategoryRepository;
use App\Repositories\BusinessRepository;
use App\Repositories\FavoriteBusinessRepository;

final class SearchService
{
    public function __construct(
        private readonly BusinessRepository $businessRepository,
        private readonly BusinessCategoryRepository $businessCategoryRepository, 
        private readonly FavoriteBusinessRepository $favoriteBusinessRepository
    ) {}

    public function getData(array $filters, array $geo): array
    {
        return [
            'categories' => $this->businessCategoryRepository->all(['id', 'name']),  
            'businesses' => $this->businessRepository->search([
                'q' => $filters['q'] ?? null,
                'category' => $filters['category'] ?? null,
                'dist' => (object) $geo,
            ]),
        ];
    }

    public function getBusinessDetails(string $idBusiness, ?int $userId = null): array
    {
        $business = $this->businessRepository->findById(
            $idBusiness,
            ['category', 'hours', 'services', 'payments', 'socialNetworks', 'productsAndServices', 'images']
        );
 
        $isFavorite = $userId ? $this->favoriteBusinessRepository->isFavorite($userId, $idBusiness) : false;
         
        return [
            'business' => BusinessMapper::toArray($business),
            'favorite' => (bool) $isFavorite,
        ];
    }

    public function getFavoritesByUser(int $userId)
    {
        return $this->businessRepository->getFavoritesByUser($userId);
    }

    public function setFavorite(int $userId, string $businessId, bool $isFavorite): bool
    {
        return $this->favoriteBusinessRepository->setFavorite($userId, $businessId, $isFavorite);
    }
}
