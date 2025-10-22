<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Http\Controllers\Controller;
use App\Http\Requests\Business\ProductsRequest;
use App\Services\Dashboard\ProductsService;
use Illuminate\Http\RedirectResponse;
use Throwable;

class ProductsController extends Controller 
{
    public function __construct(
        private readonly ProductsService $productsService
    ) {}

    public function index(string $idBusiness)
    {
        $data = $this->productsService->getData($idBusiness);

        return inertia('admin/Business/Products', $data);
    }

    public function store(ProductsRequest $request, string $idBusiness): RedirectResponse
    {
        try {
            $data = $request->validated();

            $this->productsService->create(
                $idBusiness, 
                $data, 
                $request->file('image')
            );

            return back()->with('success', 'Se agregó correctamente el servicio.');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(ProductsRequest $request, string $idBusiness, string $id): RedirectResponse
    {
        try {
            $data = $request->validated();
            
            $this->productsService->update(
                $idBusiness, 
                $id, 
                $data, 
                $request->file('image')
            );

            return back()->with('success', 'Servicio actualizado correctamente');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(string $idBusiness, string $id): RedirectResponse
    {
        try {
            $this->productsService->delete($idBusiness, $id);
            return back()->with('success', 'Servicio eliminado correctamente.');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}