<?php

namespace App\Repositories\Contracts;

use App\DTOs\SchedulesDTO;

interface BusinessRepositoryInterface extends BaseRepositoryInterface
{
    public function syncServices($id, array $services = []);

    public function syncPayments(string $id, array $payments = []);

    public function updateSchedules(string $id, SchedulesDTO $schedules);

    public function updateNetworks(string $id, array $data);

    public function createProduct($idBusiness, array $data);

    public function search(array $filters);

    public function getFavoritesByUser(int $userId);

    public function createProductVariation(string $productId, array $variation);

    public function createProductExtra(string $productId, array $variation);
}