<?php

namespace App\Services\Public;

use App\Http\Requests\Public\BusinessSearchRequest;
use App\Domains\Businesses\Mappers\BusinessMapper;
use App\Repositories\Contracts\BusinessCategoryRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\BusinessRepositoryInterface;
use App\Repositories\Contracts\FavoriteBusinessRepositoryInterface;
use App\Repositories\Contracts\ProductCategoryRepositoryInterface;
use App\Domains\Users\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;

final class SearchService
{
    public function __construct(
        private readonly BusinessRepositoryInterface $businessRepository,
        private readonly BusinessCategoryRepositoryInterface $businessCategoryRepository, 
        private readonly FavoriteBusinessRepositoryInterface $favoriteBusinessRepository,
        private readonly ProductCategoryRepositoryInterface $productCategoryRepository,
        private readonly UserRepositoryInterface $userRepositoryInterface
    ) {}

    /**
     * Obtener datos para la página principal con búsqueda optimizada
     *
     * @param BusinessSearchRequest $request 
     * @return array
     */
    public function getData(BusinessSearchRequest $request): array
    {
        $searchFilters = [];

        $filters = $request->filters();
        $geo = $request->geo();

        $distance = isset($filters['distance']) && is_numeric($filters['distance'])
            ? (float) $filters['distance']
            : 5;

        # Agregar datos de geolocalización si están disponibles
        if (!empty($geo['lat']) && !empty($geo['long'])) {
            $searchFilters['dist'] = (object) [
                'lat' => (float) $geo['lat'],
                'long' => (float) $geo['long'],
                'radius' => $distance, 
                
            ];

            $searchFilters['category'] = $filters['category'] ?? null;
            $searchFilters['q'] = $filters['q'] ?? null;
            $searchFilters['foodType'] = $filters['foodType'] ?? null;
        }

        # Buscar negocios
        $businesses = isset($searchFilters['dist'])
            ? $this->businessRepository->search($searchFilters)
            : $this->businessRepository->search([
                    'q' => $filters['q'] ?? null,
                    'category' => $filters['category'] ?? null,
                ]);

        return [
            'businesses' => BusinessMapper::toCollection($businesses),
            'categories' => $this->businessCategoryRepository->findBy(columns: ['id', 'name', 'image'], conditions: [ 'status' => true]),
            'products' => [
                'categories' => $this->productCategoryRepository->getActives(),
            ],
            'meta' => [
                'total' => count($businesses),
                'hasGeolocation' => isset($searchFilters['dist']),
                'appliedFilters' => array_filter([
                    ...$filters,
                    'distance' => $distance,
                ]),
            ],
            'filters' => $filters,
        ];
    }


    /**
     * Obtener detalles completos de un negocio
     */
    public function getBusinessDetails(int $businessId, ?int $userId = null): array
    {
        $business = $this->businessRepository->getDetails($businessId, $userId);

        return [
            'business' => BusinessMapper::toArray($business), 
            'favorite' => (bool) ($business->is_favorite ?? false)  
        ];
    }

    /**
     * Obtener negocios favoritos del usuario
     */
    public function getFavoritesByUser(int $userId): Collection
    {
        return $this->userRepositoryInterface->favoriteBusiness($userId);
    }

    /**
     * Marcar/desmarcar negocio como favorito
     */
    public function setFavorite(int $userId, string $businessId, bool $isFavorite): bool
    {
        return $this->favoriteBusinessRepository->setFavorite($userId, $businessId, $isFavorite);
    }

    /**
     * Buscar negocios con autocompletado (para búsqueda en tiempo real)
     */
    public function autocomplete(string $query, ?array $geo = null, int $limit = 5): array
    {
        $filters = [
            'q' => $query,
        ];

        // Agregar geo si está disponible
        if (!empty($geo['lat']) && !empty($geo['long'])) {
            $filters['dist'] = (object) [
                'lat' => (float) $geo['lat'],
                'long' => (float) $geo['long'],
            ];
        }

        $businesses = $this->businessRepository->search($filters);

        return $businesses
            ->take($limit)
            ->map(fn($business) => [
                'id' => $business->id,
                'name' => $business->name,
                'category' => $business->category->name ?? null,
                'distance' => $business->distance ?? null, // Si hay geo
            ])
            ->toArray();
    }

    /**
     * Obtener estadísticas de búsqueda
     */
    public function getSearchStats(array $filters, array $geo): array
    {
        $searchFilters = [
            'q' => $filters['q'] ?? null,
            'category' => $filters['category'] ?? null,
        ];

        if (!empty($geo['lat']) && !empty($geo['long'])) {
            $searchFilters['dist'] = (object) [
                'lat' => (float) $geo['lat'],
                'long' => (float) $geo['long'],
                'radius' => $filters['distance'] ?? null,
            ];
        }

        $results = $this->businessRepository->search($searchFilters);

        return [
            'total' => $results->count(),
            'hasResults' => $results->isNotEmpty(),
            'hasGeolocation' => !empty($searchFilters['dist']),
            'categories' => $results->pluck('category.name')->unique()->values(),
        ];
    }
}