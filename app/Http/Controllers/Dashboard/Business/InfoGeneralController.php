<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\InfoGeneralDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Business\InfoGeneralRequest; 

use App\Services\Dashboard\GeneralInfoService;
use Illuminate\Http\Request;

class InfoGeneralController extends Controller {

    public function __construct(
        private GeneralInfoService $generalInfoService
    )
    {
    }

    public function index ($idBusiness)
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