<?php 

namespace App\Domains\Businesses\Repositories\Eloquent;

use App\Domains\Businesses\Models\ProductCategory;
use App\Domains\Businesses\Repositories\Contracts\ProductCategoryRepositoryInterface;

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
