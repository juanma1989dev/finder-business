<?php

namespace App\Repositories\Laravel;

use App\Models\Amenity;
use App\Repositories\Contracts\AmenitiesRepositoryInterface;

class AmenitiesRepository extends BaseRepository implements AmenitiesRepositoryInterface
{
    public function __construct(Amenity $model)
    {
        $this->model = $model;     
    }

    public function getAll()
    {
        return $this->model->all();
    }
}