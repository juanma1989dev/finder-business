<?php 

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function favoriteBusiness(int $idUser): Collection;
}