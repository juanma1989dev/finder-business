<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Http\Controllers\Controller;
use App\Models\Businesses;
use App\Services\Dashboard\NetworksService;
use Illuminate\Http\Request;

class SocialNetworksController extends Controller
{
    public function __construct(private NetworksService $networksService)
    {
    }

    public function index($idBusiness)
    {
        $data = $this->networksService->getData($idBusiness);

        return inertia('admin/Business/SocialNetworks', $data);
    }

    public function store(Request $request, $id)
    {
        $this->networksService->update($request, $id);

        return redirect()->back()->with('success', 'Redes sociales actualizadas correctamente.');
    }
}