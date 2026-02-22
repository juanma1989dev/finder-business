<?php

namespace App\Domains\Businesses\Repositories\Eloquent;

use App\Domains\Businesses\Models\BusinessCategory;
use App\Domains\Businesses\Repositories\Contracts\BusinessCategoryRepositoryInterface;
use App\Domains\Shared\Repositories\Eloquent\BaseRepository;

class BusinessCategoryRepository extends BaseRepository implements BusinessCategoryRepositoryInterface
{
    public function __construct(BusinessCategory $model)
    {
        $this->model = $model;     
    }

    public function where(array $filters )
    {
        $query = $this->model->query();

        foreach ($filters as $column => $value) {
            $query->where($column, $value);
        }

        return $query->get();
    }
}
