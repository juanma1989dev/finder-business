<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\BusinessDTO;
use App\DTOs\CoverImageBusinessDTO;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\BusinessService;
use Illuminate\Support\Facades\Auth;
use \Throwable;

class BusinessController extends Controller
{

    public function __construct(
        private readonly BusinessService $businessService
    )
    {
    }

    public function index()
    {
        $userId = Auth::id();
        $data = $this->businessService->getDataListBusinessByuser($userId);

        return inertia('admin/Business', $data);
    }

    public function store()
    {
        $businessDTO = BusinessDTO::fromRequest(request());

        try { 
            $this->businessService->create($businessDTO);
 
            return redirect()->back()->with('success', 'Se creó correctamente el negocio.');

        } catch (Throwable $e) { 
            return back()->withErrors(['general' => 'Ocurrió un error al guardar el negocio.'  ]);
        }
    }

    public function update($idBusiness) 
    {
        $businessDTO = BusinessDTO::fromRequest(request());

        try
        {
            $this->businessService->update($businessDTO, $idBusiness);
            
            return redirect()->back()->with('success', 'Negocio actualizado correctamente.');
        }  
        catch(Throwable) 
        {
            return back()->withErrors(['general' => 'Ocurrió un error al actualizar el negocio.']);
        }
    }

    public function destroy($idBusiness) 
    {  
        $this->businessService->delete($idBusiness);

        return redirect()->back()->with('success', 'Se eliminó correctamente.');
    }

    public function updateCoverImage(string $idBusiness)
    {
        $coverImageDTO = CoverImageBusinessDTO::fromRequets( request() );

        $this->businessService->updateCoverImage(
            $idBusiness,
            $coverImageDTO
        );

        return redirect()->back()->with('error', 'Error al procesar la imagen.');
    }
}