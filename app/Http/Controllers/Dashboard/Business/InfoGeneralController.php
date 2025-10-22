<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Http\Controllers\Controller;
use App\Http\Requests\Business\InfoGeneralRequest; 
use Inertia\Inertia;

use App\Services\Dashboard\GeneralInfoService;

class InfoGeneralController extends Controller {

    public function __construct(
        private GeneralInfoService $generalInfoService
    )
    {
    }

    public function index ($idBusiness)
    {
        $data = $this->generalInfoService->getInfo($idBusiness);

        return Inertia::render('admin/Business/InfoGeneral', $data);
    }   
    
    public function update(InfoGeneralRequest $request, $idBusiness)
    {
        $this->generalInfoService->updateBusiness($idBusiness, $request);

        return redirect()->back()
            ->with('success', 'Negocio actualizado correctamente.');
    }
}