<?php

namespace App\Services\Dashboard;

use App\Repositories\BusinessRepository;
use Illuminate\Http\Request;
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

    public function update(Request $request,  $id)
    {
        $data = $request->validate([
            'location'    => ['required'],
            'address'     => ['required'],
            'cords'       => ['required', 'array'],
            'cords.lat'   => ['required', 'numeric', 'between:-90,90'],
            'cords.long'  => ['required', 'numeric', 'between:-180,180'],
        ]);

        // Crear objeto Point
        $data['cords'] = new Point(
            latitude: $data['cords']['lat'],
            longitude: $data['cords']['long']
        );

        $this->businessRepository->update($id, $data);
    }
}