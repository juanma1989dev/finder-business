<?php

namespace App\Repositories\Laravel;

use App\Models\BusinessImage;
use App\Models\Businesses;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class GalleryRepository implements GalleryRepositoryInterface
{
    /**
     * Obtiene todas las imágenes de un negocio
     */
    public function getByBusiness(Businesses $business): Collection
    {
        return $business->images()->get();
    }

    /**
     * Obtiene la imagen primaria de un negocio
     */
    public function getPrimaryImage(Businesses $business): ?BusinessImage
    {
        return $business->images()->where('is_primary', true)->first();
    }

    /**
     * Obtiene todas las imágenes primarias (para detectar duplicados)
     */
    public function getPrimaryImages(Businesses $business): Collection
    {
        return $business->images()->where('is_primary', true)->get();
    }

    /**
     * Crea o actualiza una imagen
     */
    public function createOrUpdate(string $businessId, string $url, bool $isPrimary = false): BusinessImage
    {
        return BusinessImage::updateOrCreate(
            ['business_id' => $businessId, 'url' => $url],
            ['is_primary' => $isPrimary]
        );
    }

    /**
     * Elimina una imagen
     */
    public function delete(BusinessImage $image): bool
    {
        return $image->delete();
    }

    /**
     * Elimina todas las imágenes de un negocio
     */
    public function deleteAll(Businesses $business): int
    {
        return $business->images()->delete();
    }

    /**
     * Marca una imagen como primaria y desmarca las demás
     */
    public function setPrimary(BusinessImage $image): void
    {
        // Obtener el negocio y usar su relación
        $business = $image->business;
        
        // Usar la relación como en el código original
        $business->images()
            ->where('id', '!=', $image->id)
            ->update(['is_primary' => false]);

        // Marcar esta como primaria
        $image->update(['is_primary' => true]);
    }

    /**
     * Encuentra imágenes por sus URLs
     */
    public function findByUrls(Businesses $business, array $urls): Collection
    {
        return $business->images()->whereIn('url', $urls)->get();
    }

    /**
     * Encuentra imágenes que NO están en una lista de URLs
     */
    public function findNotInUrls(Businesses $business, array $urls): Collection
    {
        return $business->images()->whereNotIn('url', $urls)->get();
    }

    /**
     * Cuenta las imágenes de un negocio
     */
    public function count(Businesses $business): int
    {
        return $business->images()->count();
    }

    /**
     * Verifica si un negocio tiene imágenes
     */
    public function hasImages(Businesses $business): bool
    {
        return $business->images()->exists();
    }

    /**
     * Obtiene imágenes ordenadas (primaria primero)
     */
    public function getOrderedImages(Businesses $business): Collection
    {
        return $business->images()
            ->orderByDesc('is_primary')
            ->orderBy('created_at')
            ->get();
    }
}