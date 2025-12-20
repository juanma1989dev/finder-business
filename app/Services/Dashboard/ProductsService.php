<?php

namespace App\Services\Dashboard;

use App\DTOs\ImageDTO;
use App\DTOs\ProductsDTO;
use App\Mappers\ProductsAndServicesMapper;
use App\Models\Businesses;
use App\Repositories\Contracts\BusinessRepositoryInterface;
use App\Repositories\Contracts\ProductCategoryRepositoryInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Exception;

class ProductsService
{
    public function __construct(
        private readonly BusinessRepositoryInterface $businessRepository,
        private readonly ProductCategoryRepositoryInterface $productCategoryRepository
    ) {}

    /**
     * Obtiene los datos de productos/servicios del negocio.
     */
    public function getData(string $idBusiness): array
    {
        $business  = $this->businessRepository->findById($idBusiness, ['category']);
        $foodTypes = $this->productCategoryRepository->getActives();
        $products  = ProductsAndServicesMapper::toArray($business->productsAndServices);

        return [
            'business' => $business,
            'productTypes' => $foodTypes,
            'productsAndServices' => $products
        ];
    }

    /**
     * Crea un nuevo producto o servicio asociado al negocio.
     */
    public function create(string $idBusiness, ProductsDTO $product): void
    {
        DB::transaction(function () use ($idBusiness, $product) {

            $data = $product->toPersistenceArray();
            $data['id'] = (string) Str::uuid();

            if ($product->image) {
                $data['image_url'] = $this->storeServiceImage(
                    $product->image,
                    $idBusiness
                );
            }

            $productModel = $this->businessRepository
                ->createProductOrService($idBusiness, $data);

            foreach ($product->variations as $variation) {
                $this->businessRepository
                    ->createProductVariation($productModel->id, $variation);
            }

            foreach ($product->extras as $extra) {
                $this->businessRepository
                    ->createProductExtra($productModel->id, $extra);
            }
        });
    }

    /**
     * Actualiza un producto o servicio existente.
     */
    public function update(string $idBusiness, string $idService, ProductsDTO $productDto)
    {
        DB::transaction(function () use ($idBusiness, $productDto, $idService) {
            $data = $productDto->toPersistenceArray();

            $product = $this->findProduct($idBusiness, $idService);

            if ($productDto->image) {
                $data['image_url'] = $this->replaceImage($product, $productDto->image, $idBusiness);
            }

            $product->update($data); //// migrar al repo

            # Eliminar variaciones existentes
            $product->variations()->delete(); //// migrar al repo

            # Insertar nuevas variaciones
            foreach ($productDto->variations as $variation) {
                $this->businessRepository->createProductVariation($product->id, $variation);
            }

            # Eliminar extras existentes
            $product->extras()->delete(); //// migrar al repo

            # Guardar Extras
            foreach ($productDto->extras as $extra) {
                $this->businessRepository->createProductExtra($product->id, $extra);
            }

            return $product->fresh();
        });
    }

    /**
     * Elimina un servicio (y su imagen si existe).
     */
    public function delete(string $idBusiness, string $idService): bool
    {
        $service = $this->findProduct($idBusiness, $idService);

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
    private function findProduct(string $idBusiness, string $idService)
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