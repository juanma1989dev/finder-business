<?php

namespace App\Repositories\Laravel;

use App\Models\FavoriteBusiness;
use App\Repositories\Contracts\FavoriteBusinessRepositoryInterface;

class FavoriteBusinessRepository extends BaseRepository implements FavoriteBusinessRepositoryInterface
{
    public function __construct(
        FavoriteBusiness $model
    )
    {
        $this->model = $model;
    }

    public function isFavorite(int $userId, string $businessId)
    {
        return (bool) FavoriteBusiness::where([
            'id_user' => $userId,
            'id_business' => $businessId,
        ])->value('is_favorite') ?? false;
    }

    public function setFavorite(int $userId, string $businessId, bool $isFavorite): bool
    {
        return (bool) $this->model->newQuery()->updateOrInsert(
            ['id_user' => $userId, 'id_business' => $businessId],
            ['is_favorite' => $isFavorite]
        );
    } 
}