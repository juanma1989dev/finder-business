<?php

namespace App\Repositories;

use App\Models\Payments;

class PaymentsRepository extends BaseRepository
{
    public function __construct(Payments $model)
    {
        $this->model = $model;     
    }

    public function getAll()
    {
        return $this->model->all();
    }
}