<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\DayOfWeek;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBusinessRequest;
use App\Models\BusinessCategory;
use App\Models\Businesses;
use App\Models\CodeValidate;
use App\Models\Payments;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    // public function create(Request $request)
    // {
    //     $codeParam = $request->query('validate');

    //     if (!$codeParam) {
    //         $categories = BusinessCategory::all(['id', 'name', 'image']);
    //         return Inertia::render('admin/CreateBusiness', [
    //             'categories' => $categories,
    //             'errorMessage' => 'Código no proporcionado'
    //         ]);
    //     }

    //     $codeParam = base64_decode($codeParam);
    //     if (!$codeParam) {
    //         $categories = BusinessCategory::all(['id', 'name', 'image']);
    //         return Inertia::render('admin/CreateBusiness', [
    //             'categories' => $categories,
    //             'errorMessage' => 'Código inválido'
    //         ]);
    //     }

    //     $codeFromDB = CodeValidate::where('code', $codeParam)
    //         ->where('created_at', '>=', now()->subMinutes(10))
    //         ->first();

    //     $categories = BusinessCategory::all(['id', 'name', 'image']);

    //     if (!$codeFromDB) {
    //         return Inertia::render('admin/CreateBusiness', [
    //             'categories' => $categories,
    //             'errorMessage' => 'Código inválido o expirado'
    //         ]);
    //     }

    //     // Si todo está bien, simplemente renderizas la página sin error
    //     return Inertia::render('admin/CreateBusiness', [
    //         'categories' => $categories,
    //         'errorMessage' => null
    //     ]);
    // }

    public function store(CreateBusinessRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        Businesses::create($data);

        return redirect('dashboard/business/create');
    }


    public function edit($id)
    {
        $business = Businesses::with(['hours', 'category', 'services', 'payments'])->findOrFail($id);
        $daysOfWeek = DayOfWeek::toOptions();

        $data = [
            'categories' => BusinessCategory::whereStatus(true)->get(),  
            'business' => $business,
            'daysOfWeek' => $daysOfWeek,
            'services' => Services::all(),
            'payments' => Payments::all(),
            'productsAndServices' => Inertia::defer(function() use($business) {
                return $business->productsAndServices()->get();
            })
        ];

        return Inertia::render('admin/EditBusiness', $data);
    }

    public function update(CreateBusinessRequest $request, $id)
    {
        $business = Businesses::findOrFail($id);

        // Actualizar los campos principales
        $business->update($request->only([
            'name',
            'description',
            'long_description',
            'address',
            'phone',
            'id_category',
            'use_whatsapp',
            'cover_image',
        ]));

        # Sincronizar los servicios
        $business->services()->sync($request->services ?? []);

        $business->payments()->sync($request->payments ?? []);
        
        return redirect()->back()
            ->with('success', 'Negocio actualizado correctamente.');
    }

    /***************/
    public function codes()
    {
        $data = [
            'numBusiness' => Businesses::where('user_id', Auth::id())->count(),
        ];

        return Inertia::render('admin/CodeValidation', $data);
    }
    public function codeValidate(Request $request)
    {
        $code = $request->input('code');
        $email = $request->input('email');

        $codeForValidate = CodeValidate::where([
            'user_email' => $email,
            'code' => $code,
            'confirmed' => false,
        ])->update(['confirmed' => true]);

        $successUpdate = $codeForValidate > 0 ;
       
        return redirect('/dashboard/profile/business/confirm-code')->with('meta', [
            'validated' => $successUpdate
        ]);
    }

    public function codeCreate(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $code = Str::upper(Str::random(10));

        CodeValidate::create([
            'user_email' => $request->email,
            'code' => $code,
        ]);

        return redirect('/dashboard/profile/business/confirm-code')->with('meta', [
            'code' => $code
        ]);
    }

    
}