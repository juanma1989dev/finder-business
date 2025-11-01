<?php

namespace App\Repositories\Laravel;

use App\Models\Services;

class AmenitiesRepository extends BaseRepository
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