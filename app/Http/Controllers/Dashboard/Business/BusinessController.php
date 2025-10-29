<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\BusinessDTO;
use App\Http\Controllers\Controller;
use App\Models\BusinessCategory;
use App\Models\Businesses;
use App\Services\Dashboard\BusinessService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use MatanYadaev\EloquentSpatial\Objects\Point;
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

        return Inertia::render('admin/Business', $data);
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

    public function updateCoverImage(Request $request, $idBusiness)
    {
        $business = Businesses::find($idBusiness);

        $request->validate([
            'cover_image' => ['required', 'image', 'max:2048'], // Máximo 2MB
        ]);

        if ($request->file('cover_image')->isValid()) {
            if ($business->cover_image) {
                Storage::disk('public')->delete($business->cover_image);
            }

            $path = $request->file('cover_image')->store("business_covers/{$idBusiness}", 'public');

            $business->update(['cover_image' => $path]);

            return redirect()->back()
                ->with('success', 'Imagen de portada actualizada correctamente.');
        }

        return redirect()->back()->with('error', 'Error al procesar la imagen.');
    }
}