<?php 

namespace App\Services\Dashboard;

use App\DTOs\BusinessDTO;
use App\Repositories\BusinessRepository;

class BusinessService
{
    public function __construct(
        private readonly BusinessRepository $businessRepository
    )
    {
    }

    public function create(BusinessDTO $businessDTO, $idBusiness)
    {
        $business = $this->businessRepository->findById($idBusiness);
            
        return $business->update($businessDTO->toArray());
    }
}