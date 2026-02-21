<?php

namespace App\Repositories\Laravel;

use App\Domains\Users\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Laravel\BaseRepository;
use Illuminate\Support\Collection;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function favoriteBusiness(int $idUser): Collection
    {
        $user = $this->findById($idUser);

        return $user->favorites()
            ->where('is_favorite', true)
            ->with(['category:id,name,image'])
            ->orderBy('name', 'asc')
            ->get();
    }
}