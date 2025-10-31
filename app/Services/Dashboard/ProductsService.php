<?php

namespace App\Services\Dashboard;

use App\DTOs\ImageDTO;
use App\DTOs\ProductsDTO;
use App\Mappers\ProductsAndServicesMapper;
use App\Models\Businesses;
use App\Repositories\BusinessRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

class ProductsService
{
    public function __construct(
        private readonly BusinessRepository $businessRepository
    ) {}

    /**
     * Obtiene los datos de productos/servicios del negocio.
     */
    public function getData(string $idBusiness): array
    {
        $business = $this->businessRepository->findById($idBusiness, ['category']);

        return [
            'business' => $business,
            'productsAndServices' => ProductsAndServicesMapper::toArray($business->productsAndServices)
        ];
    }

    /**
     * Crea un nuevo producto o servicio asociado al negocio.
     */
    public function create(string $idBusiness, ProductsDTO $product): void
    {
        $data = $product->toArray();

        $data['id'] = (string) Str::uuid();

        if ($product->image) {
            $data['image_url'] = $this->storeServiceImage($product->image, $idBusiness);
        }

        $this->businessRepository->createProductOrService($idBusiness, $data);
    }

    /**
     * Actualiza un producto o servicio existente.
     */
    public function update(string $idBusiness, string $idService, ProductsDTO $product)
    {
        $data = $product->toArray();

        $service = $this->findServiceOrFail($idBusiness, $idService);

        if ($product->image) {
            $data['image_url'] = $this->replaceImage($service, $product->image, $idBusiness);
        }

        $service->update($data);

        return $service->fresh();
    }

    /**
     * Elimina un servicio (y su imagen si existe).
     */
    public function delete(string $idBusiness, string $idService): bool
    {
        $service = $this->findServiceOrFail($idBusiness, $idService);

        if ($service->image_url) {
            Storage::disk('public')->delete($service->image_url);
        }

        return (bool) $service->delete();
    }

    /**
     * Guarda una nueva imagen en el disco.
     */
    public function storeServiceImage(ImageDTO $file, string $idBusiness): string
    {
        $path = "business_services/{$idBusiness}";
        $filename = Str::uuid() . '.' . $file->extension;

        return Storage::disk('public')->putFileAs(
            $path, 
            $file->filePath, 
            $filename
        );
    }

    /**
     * Reemplaza la imagen actual del servicio por una nueva.
     */
    private function replaceImage($service, $newImage, string $idBusiness): string
    {
        if ($service->image_url) {
            Storage::disk('public')->delete($service->image_url);
        }

        return $this->storeServiceImage($newImage, $idBusiness);
    }

    /**
     * Busca un servicio y lanza excepción si no existe.
     */
    private function findServiceOrFail(string $idBusiness, string $idService)
    {
        $business = $this->businessRepository->findById($idBusiness);
        $service = $this->findByBusiness($business, $idService);

        if (!$service) {
            throw new Exception('Servicio no encontrado para este negocio');
        }

        return $service;
    }

    /**
     * Busca un servicio dentro de un negocio.
     */
    private function findByBusiness(Businesses $business, string $id)
    {
        return $business->productsAndServices()->find($id);
    }
}