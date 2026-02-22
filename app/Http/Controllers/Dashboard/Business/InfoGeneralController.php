<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Domains\Businesses\Dtos\InfoGeneralDTO;
use App\Http\Controllers\Controller;
use App\Domains\Businesses\Services\GeneralInfoService;
use Illuminate\Http\Request;

class InfoGeneralController extends Controller {

    public function __construct(
        private GeneralInfoService $generalInfoService
    )
    {
    }

    public function edit ($idBusiness)
    {
        $data = $this->generalInfoService->getInfo($idBusiness);

        return inertia('admin/Business/InfoGeneral', $data);
    }   
    
    public function update(Request $request, $idBusiness)
    {
        $info = InfoGeneralDTO::fromRequest($request);

        $this->generalInfoService->updateBusiness($idBusiness, $info);

        return redirect()->back()
            ->with('success', 'Negocio actualizado correctamente.');
    }
}