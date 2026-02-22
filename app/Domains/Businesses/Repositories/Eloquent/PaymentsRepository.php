<?php

namespace App\Domains\Businesses\Repositories\Eloquent;

use App\Domains\Businesses\Models\Payments;
use App\Domains\Businesses\Repositories\Contracts\PaymentsRepositoryInterface;
use App\Domains\Shared\Repositories\Eloquent\BaseRepository;

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
