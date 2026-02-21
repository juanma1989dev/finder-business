<?php

namespace App\Repositories\Laravel;

// use App\Models\BusinessUser;

use App\Domains\Businesses\Models\BusinessUser;
use App\Domains\Users\Models\User;
use App\Repositories\Contracts\FavoriteBusinessRepositoryInterface;

class FavoriteBusinessRepository extends BaseRepository implements FavoriteBusinessRepositoryInterface
{
    public function __construct(
        BusinessUser $model
    )
    {
        $this->model = $model;
    }

    public function setFavorite(int $userId, int $businessId, bool $isFavorite): bool
    {
        $user = User::findOrFail($userId);

        $exists = $user->businesses()
            ->wherePivot('business_id', $businessId)
            ->exists();


        $user->businesses()->syncWithoutDetaching([
            $businessId => ['is_favorite' => $isFavorite],
        ]);

        return $exists;
    }
}