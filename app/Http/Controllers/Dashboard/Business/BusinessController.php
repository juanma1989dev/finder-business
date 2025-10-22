<?php

namespace App\Http\Controllers\Dashboard\Business;


use App\Http\Controllers\Controller;
use App\Models\BusinessCategory;
use App\Models\Businesses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use MatanYadaev\EloquentSpatial\Objects\Point;
use \Throwable;

class BusinessController extends Controller
{
    public function index()
    {
        $businesses = Businesses::with(['category'])->where('user_id', Auth::id())->get();
        
        $data = [
            'businesses' => $businesses,
            'catalogs' => [
                'categories' => BusinessCategory::all()
            ]
        ];

        return Inertia::render('admin/Business', $data);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "name"              => ['required', 'string', 'max:255'],
            "id_category"       => ['required'],
            "description"       => ['required', 'string'],
            "long_description"  => ['required', 'string'],
            "phone"             => ['required', 'string'],
            "use_whatsapp"      => ['required', 'boolean'],

            "location"      => ['required'],
            "address"       => ['required'],
            "cords"         => ['required', 'array'],
            "cords.lat"     => ['required', 'numeric', 'between:-90,90'],
            "cords.long"    => ['required', 'numeric', 'between:-180,180'],
        ]);

        $data['cords'] = new Point(
            latitude: $data['cords']['lat'],
            longitude: $data['cords']['long']
        );

        // Asignar el usuario actual
        $data['user_id'] = Auth::id();


        try { 
            Businesses::create($data);
 
            return redirect()->back()->with('success', 'Se creó correctamente el negocio.');

        } catch (Throwable $e) { 
            return back()->withErrors(['general' => 'Ocurrió un error al guardar el negocio.'  ]);
        }
    }

    public function update(Request $request, $idBusiness) 
    {
        $data = $request->validate([
            "name" => ['required'],
            "id_category" => ['required'],
            "description" => ['required'],
            "long_description" => ['required'],
            "phone" => ['required'],
            "use_whatsapp" => ['required'],
            
            "location"      => ['required'],
            "address"       => ['required'],
            "cords"         => ['required', 'array'],
            "cords.lat"     => ['required', 'numeric', 'between:-90,90'],
            "cords.long"    => ['required', 'numeric', 'between:-180,180'],
        ]);




        try
        {
            $business = Businesses::findOrFail($idBusiness); 
            
            $business->update($data);
            
            return redirect()->back()
            ->with('success', 'Negocio actualizado correctamente.');
        }  
        catch(\Throwable) 
        {
            return back()->withErrors(['general' => 'Ocurrió un error al actualizar el negocio.']);
        }
    }

    public function destroy($idBusiness) 
    {  
        $business = Businesses::findOrFail($idBusiness); 

        $business->delete();

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