<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\BusinessService;
use Exception;
use Illuminate\Http\Request;

class BusinessOpeningController extends Controller
{
    public function __construct(
        private readonly BusinessService $businessService
    )
    {
    }

    public function update(Request $request)
    {
        $data = $request->all();

        try {
            $this->businessService->manageOpening($data);

            return redirect()->back()->with('success', 'Horario actualizado correctamente.');
        } catch(Exception $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }
    }
}