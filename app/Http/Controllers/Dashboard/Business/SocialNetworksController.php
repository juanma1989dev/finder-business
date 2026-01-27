<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\NetworksDTO;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\NetworksService;
use Illuminate\Http\Request;

class SocialNetworksController extends Controller
{
    public function __construct(private NetworksService $networksService)
    {
    }

    public function edit($idBusiness)
    {
        $data = $this->networksService->getData($idBusiness);

        return inertia('admin/Business/SocialNetworks', $data);
    }

    public function update(Request $request, $id, string $slug)
    {
        $networks = NetworksDTO::fromRequest($request);
        
        $this->networksService->update($networks, $id);

        return redirect()->back()->with('success', 'Redes sociales actualizadas correctamente.');
    }
}