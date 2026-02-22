<?php

namespace App\Domains\Businesses\Repositories\Contracts;

use App\Domains\Businesses\Models\Business;
use App\Domains\Businesses\Models\BusinessImage;
use Illuminate\Support\Collection;

interface GalleryRepositoryInterface
{
    public function getGallery(Business $business): Collection;

    public function getPrimaryImage(Business $business);

    public function getPrimaryImages(Business $business);

    public function createOrUpdate(string $businessId, string $url, bool $isPrimary = false);

    public function delete(BusinessImage $image): bool;

    public function deleteAll(Business $business): int;

    public function setPrimary(BusinessImage $image): void;

    public function findByUrls(Business $business, array $urls);

    public function findNotInUrls(Business $business, array $urls);
   
    public function count(Business $business): int;

    public function hasImages(Business $business): bool;

    public function getOrderedImages(Business $business);
}
