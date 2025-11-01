<?php

namespace App\Repositories\Laravel;

use App\Models\BusinessCategory;
use App\Repositories\Contracts\BusinessCategoryRepositoryInterface;

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