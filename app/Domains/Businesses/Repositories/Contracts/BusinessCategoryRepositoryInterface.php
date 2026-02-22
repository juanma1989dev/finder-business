<?php 

namespace App\Domains\Businesses\Repositories\Contracts;

use App\Domains\Shared\Repositories\Contracts\BaseRepositoryInterface;

interface BusinessCategoryRepositoryInterface extends BaseRepositoryInterface
{
    public function where(array $filters );
}
