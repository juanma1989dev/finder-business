<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\LocationBusinessDTO;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller 
{
    public function __construct(
        private LocationService $locationService
    )
    {
    }

    public function index($idBusiness)
    {
        $data = $this->locationService->getData($idBusiness);

        return inertia('admin/Business/Location', $data);
    }

    public function store(Request $request, $id)
    {
        $location = LocationBusinessDTO::fromRequest($request);

        $this->locationService->update($location, $id);

        return redirect()->back()->with('success', 'Ubicación actualizada correctamente.');
    }
}
