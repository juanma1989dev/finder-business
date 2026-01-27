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
            
            $productModel = $this->businessRepository->createProduct($idBusiness, $data);

            foreach ($product->variations as $variation) {
                $this->businessRepository->createProductVariation($productModel->id, $variation);
            }

            foreach ($product->extras as $extra) {
                $this->businessRepository->createProductExtra($productModel->id, $extra);
            }
        });

        if ($product->image) {
            $data['image_url'] = $this->storeServiceImage(
                $product->image,
                $idBusiness
            );

            $this->businessRepository->update($data['id'], ['image_url' => $data['image_url']]);
        }
    }

    /**
     * Actualiza un producto o servicio existente.
     */
    public function update(
        string $idBusiness,
        string $idService,
        ProductsDTO $productDto
    ) {
        return DB::transaction(function () use ($idBusiness, $idService, $productDto) 
        {
            $product = $this->findProduct($idBusiness, $idService);

            $data = $productDto->toPersistenceArray();

            # 1. Viene nueva imagen → reemplazar
            if ($productDto->image) {
                $data['image_url'] = $this->replaceImage(
                    $product,
                    $productDto->image,
                    $idBusiness
                );
            }

            # 2. No viene image ni image_url → eliminar imagen
            if (
                !$productDto->image &&
                empty($productDto->image_url) &&
                $product->image_url
            ) {
                Storage::disk('public')->delete($product->image_url);
                $data['image_url'] = null;
            }

            # 3. Viene image_url → no hacer nada (no tocar image_url)
            if (!empty($productDto->image_url)) {
                unset($data['image_url']);
            }

            $product->update($data);

            # Se crean las variaciones del producto
            $product->variations()->delete();

            foreach ($productDto->variations as $variation) {
                $this->businessRepository->createProductVariation($product->id, $variation);
            }

            # Se crean los extras del producto
            $product->extras()->delete();
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