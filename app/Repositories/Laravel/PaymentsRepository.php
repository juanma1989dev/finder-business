<?php

namespace App\Repositories\Laravel;

use App\Models\Payments;
use App\Repositories\Contracts\PaymentsRepositoryInterface;

class PaymentsRepository extends BaseRepository implements PaymentsRepositoryInterface
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