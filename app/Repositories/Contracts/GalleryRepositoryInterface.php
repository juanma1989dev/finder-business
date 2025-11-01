<?php

namespace App\Repositories\Contracts;

use App\Models\Businesses;
use App\Models\BusinessImage;

interface GalleryRepositoryInterface
{
    public function getByBusiness(Businesses $business);

    public function getPrimaryImage(Businesses $business);

    public function getPrimaryImages(Businesses $business);

    public function createOrUpdate(string $businessId, string $url, bool $isPrimary = false);

    public function delete(BusinessImage $image): bool;

    public function deleteAll(Businesses $business): int;

    public function setPrimary(BusinessImage $image): void;

    public function findByUrls(Businesses $business, array $urls);

    public function findNotInUrls(Businesses $business, array $urls);
   
    public function count(Businesses $business): int;

    public function hasImages(Businesses $business): bool;

    public function getOrderedImages(Businesses $business);
}