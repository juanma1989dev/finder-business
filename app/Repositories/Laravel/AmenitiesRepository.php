<?php

namespace App\Repositories\Laravel;

use App\Models\Services;
use App\Repositories\Contracts\AmenitiesRepositoryInterface;

class AmenitiesRepository extends BaseRepository implements AmenitiesRepositoryInterface
{
    public function __construct(Services $model)
    {
        $this->model = $model;     
    }

    public function getAll()
    {
        return $this->model->all();
    }
}