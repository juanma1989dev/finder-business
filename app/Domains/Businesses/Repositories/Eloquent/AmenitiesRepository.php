<?php

namespace App\Domains\Businesses\Repositories\Eloquent;

use App\Domains\Businesses\Models\Amenity;
use App\Domains\Businesses\Repositories\Contracts\AmenitiesRepositoryInterface;
use App\Domains\Shared\Repositories\Eloquent\BaseRepository;

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
