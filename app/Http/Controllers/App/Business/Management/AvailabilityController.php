<?php

namespace App\Http\Controllers\App\Business\Management;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Domains\Businesses\Services\BusinessService;

class AvailabilityController extends Controller
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