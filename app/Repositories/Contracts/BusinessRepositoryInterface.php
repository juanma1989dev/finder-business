<?php

namespace App\Repositories\Contracts;

use App\DTOs\SchedulesDTO;
use App\Models\Businesses;

interface BusinessRepositoryInterface extends BaseRepositoryInterface
{
    public function syncAmenities($id, array $services = []);

    public function syncPayments(string $id, array $payments = []);

    public function updateSchedules(string $id, SchedulesDTO $schedules);

    public function updateNetworks(string $id, array $data);

    public function createProduct($idBusiness, array $data);

    public function search(array $filters);

    public function getDetails(int $businessId, int $userId): Businesses;

    public function createProductVariation(string $productId, array $variation);

    public function createProductExtra(string $productId, array $variation);
}