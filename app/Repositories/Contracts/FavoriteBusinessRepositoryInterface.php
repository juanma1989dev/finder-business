<?php 

namespace App\Repositories\Contracts;

interface FavoriteBusinessRepositoryInterface
{
    public function setFavorite(int $userId, int $businessId, bool $isFavorite) : bool;
}