<?php

namespace App\Services\Dashboard;

use App\DTOs\LocationBusinessDTO;
use App\Repositories\BusinessRepository;
use MatanYadaev\EloquentSpatial\Objects\Point;

class LocationService
{
    public function __construct(
        private BusinessRepository $businessRepository
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
        $data['cord'] = $cords;

        $this->businessRepository->update($id, $data);
    }
}