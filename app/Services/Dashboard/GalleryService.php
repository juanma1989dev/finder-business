<?php 

namespace App\Services\Dashboard;

use App\DTOs\GalleryBusinessDTO;
use App\DTOs\GalleryImagesDTO;
use App\DTOs\ImageBusinessDTO;
use App\Mappers\BusinessMapper;
use App\Repositories\BusinessRepository;

use App\Models\Businesses;
use App\Repositories\GalleryRpository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class GalleryService 
{
    public function __construct(
        private BusinessRepository $businessRepository,
        private GalleryRpository $galleryRpository
    )
    {
    }

    public function getData($idBusiness)
    {
        $business = $this->businessRepository->findById($idBusiness);  
        
        return [
            'business' => BusinessMapper::toArray($business),
        ];
    }

    /**
     * Sincroniza la galería de imágenes de un negocio
     */
    public function syncGallery($businessId, GalleryBusinessDTO $gallery): void
    {
        DB::transaction(function () use ($businessId, $gallery) {

            $business = $this->businessRepository->findById($businessId);

            $existingImages = $this->galleryRpository->getByBusiness($business);
            
            # Si no hay imágenes, eliminar todas
            if($gallery->isEmpty()) {
                $this->deleteAllImages($existingImages);
                return;
            }

            # Procesar imágenes
            $incomingPaths = $this->processImages($business, $gallery);

            # Eliminar imágenes que ya no están
            $this->deleteRemovedImages($business, $incomingPaths);

            # Asegurar una sola imagen primaria
            $this->ensureSinglePrimaryImage($business);
        });
    }


    /**
     * Procesa todas las imágenes (nuevas y existentes)
     */
    private function processImages(Businesses $business, GalleryBusinessDTO $gallery): array
    {
        $incomingPaths = [];

        foreach ($gallery->images as $imageData) {

            $path = $this->processImage($imageData, $business->id);

            if (!$path) continue;

            $incomingPaths[] = $path;

            # Usar repository en lugar de Eloquent directo
            $this->galleryRpository->createOrUpdate(
                $business->id,
                $path,
                $imageData->isPrimary ?? false
            );
        }

        return $incomingPaths;
    }

    /**
     * Procesa una imagen individual (nueva o existente)
     */
    private function processImage(ImageBusinessDTO $image, string $businessId): ?string
    {
        # Imagen nueva subida
        if (isset($image->filePath) && $image->filePath instanceof UploadedFile) {
            return $this->uploadImage($image->filePath, $businessId);
        }

        # Imagen existente con URL
        if (!empty($image->url)) {
            return $this->cleanUrl($image->url);
        }

        return null;
    }

    /**
     * Sube una imagen nueva al storage
     */
    private function uploadImage(UploadedFile $file, string $businessId): string
    {
        return $file->store("business_images/{$businessId}/gallery", 'public');
    }

    /**
     * Limpia la URL removiendo el prefijo /storage/ si existe
     */
    private function cleanUrl(string $url): string
    {
        return str_starts_with($url, '/storage/')
            ? substr($url, 9)
            : $url;
    }

    /**
     * Elimina imágenes que ya no están en el request
     */
    private function deleteRemovedImages(Businesses $business, array $incomingPaths): void
    {
        $imagesToDelete = $this->galleryRpository->findNotInUrls($business, $incomingPaths);
        
        $imagesToDelete->each(function ($img) {
            Storage::disk('public')->delete($img->url);
            $this->galleryRpository->delete($img);
        });
    }

    /**
     * Elimina todas las imágenes de un negocio
     */
    private function deleteAllImages($images): void
    {
        $images->each(function ($img) {
            Storage::disk('public')->delete($img->url);
            $this->galleryRpository->delete($img);
        });
    }

    /**
     * Asegura que solo haya una imagen primaria
     */
    private function ensureSinglePrimaryImage(Businesses $business): void
    {
        $primaryImages = $this->galleryRpository->getPrimaryImages($business);

        // Si hay múltiples primarias, mantener solo la primera
        if ($primaryImages->count() > 1) {
            $firstPrimary = $primaryImages->first();
            $this->galleryRpository->setPrimary($firstPrimary);
        }

        // Si no hay ninguna primaria y hay imágenes, establecer la primera
        if ($primaryImages->isEmpty() && $this->galleryRpository->hasImages($business)) {
            $firstImage = $this->galleryRpository->getByBusiness($business)->first();
            $this->galleryRpository->setPrimary($firstImage);
        }
    }
}