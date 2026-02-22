<?php

namespace App\Domains\Businesses\Repositories\Contracts;

use App\Domains\Businesses\Dtos\SchedulesDTO;
use App\Domains\Businesses\Models\Business;
use App\Domains\Shared\Repositories\Contracts\BaseRepositoryInterface;

interface BusinessRepositoryInterface extends BaseRepositoryInterface
{
    public function syncAmenities($id, array $services = []);

    public function syncPayments(string $id, array $payments = []);

    public function updateSchedules(string $id, SchedulesDTO $schedules);

    public function updateNetworks(string $id, array $data);

    public function createProduct($idBusiness, array $data);

    public function search(array $filters);

    public function getDetails(int $businessId, int $userId): Business;

    public function createProductVariation(string $productId, array $variation);

    public function createProductExtra(string $productId, array $variation);
}