<?php

namespace App\Services\Dashboard;

use App\DTOs\LocationBusinessDTO;
use App\Repositories\Contracts\BusinessRepositoryInterface;
use MatanYadaev\EloquentSpatial\Objects\Point;

class LocationService
{
    public function __construct(
        private BusinessRepositoryInterface $businessRepository
    )
    {        
    }

    public function getData($id)
    {
        $business = $this->businessRepository->findById($id, ['category']);

        return [
            'business' => $business,
        ];
    }

    public function update(LocationBusinessDTO $location,  $id)
    {
        $cords = new Point(
            latitude: $location->cord->lat,
            longitude: $location->cord->long
        );

        $data = $location->toArray();
        $data['cords'] = $cords;

        $this->businessRepository->update($id, $data);
    }
}