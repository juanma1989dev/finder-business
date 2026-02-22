<?php 

namespace App\Domains\Users\Repositories\Contracts;

use App\Domains\Shared\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Support\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function favoriteBusiness(int $idUser): Collection;
}
