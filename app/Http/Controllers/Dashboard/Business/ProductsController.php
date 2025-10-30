<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\ProductsDTO;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\ProductsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function store(Request $request, string $idBusiness): RedirectResponse
    {
        try {
            $product = ProductsDTO::fromRequest($request);

            $this->productsService->create($idBusiness, $product);

            return back()->with('success', 'Se agregó correctamente el servicio.');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, string $idBusiness, string $id): RedirectResponse
    {
        try {
            $product = ProductsDTO::fromRequest($request);
            
            $this->productsService->update( $idBusiness, $id, $product );

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