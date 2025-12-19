<?php 

namespace App\Repositories\Laravel;

use App\Models\ProductCategory;
use App\Repositories\Contracts\ProductCategoryRepositoryInterface;

class ProductCategoryRepository implements ProductCategoryRepositoryInterface
{
    public function __construct(private readonly ProductCategory $model)
    {
    }

    public function getActives()
    {
        return $this->model->where('status', true)->get();
    }
}