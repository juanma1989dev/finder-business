<?php 

namespace App\Repositories\Contracts;

interface FavoriteBusinessRepositoryInterface
{
    public function isFavorite(int $userId, string $businessId);

    public function setFavorite(int $userId, string $businessId, bool $isFavorite) : bool;
}