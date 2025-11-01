<?php 

namespace App\Repositories\Contracts;

interface BusinessCategoryRepositoryInterface extends BaseRepositoryInterface
{
    public function where(array $filters );
}