<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Domains\Businesses\Dtos\ProductsDTO;
use App\Http\Controllers\Controller;
use App\Domains\Businesses\Services\ProductsService;
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

    public function store(Request $request, string $idBusiness, string $slug): RedirectResponse
    {
        $product = ProductsDTO::fromRequest($request);
        
        try {
            $this->productsService->create($idBusiness, $product);

            return back()->with('success', 'Se agregó correctamente el servicio.');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, string $idBusiness, string $slug, string $id): RedirectResponse
    {
        $product = ProductsDTO::fromRequest($request);

        try {            
            $this->productsService->update( $idBusiness, $id, $product );
            return back()->with('success', 'Servicio actualizado correctamente');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(string $idBusiness, string $slug,  string $id): RedirectResponse
    {
        try {
            $this->productsService->delete($idBusiness, $id);
            return back()->with('success', 'Servicio eliminado correctamente.');
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}