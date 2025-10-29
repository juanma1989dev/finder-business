<?php 

namespace App\Services\Dashboard;

use App\DTOs\BusinessDTO;
use App\Models\BusinessCategory;
use App\Models\Businesses;
use App\Repositories\BusinessCategoryRepository;
use App\Repositories\BusinessRepository;
use Illuminate\Support\Facades\Auth;

class BusinessService
{
    public function __construct(
        private readonly BusinessRepository $businessRepository,
        private readonly BusinessCategoryRepository $businessCategoryRepository
    )
    {
    }

    public function getDataListBusinessByuser(int $userId)
    {
        return [
            'businesses' => $this->businessRepository->findBy(['user_id' => $userId], ['category']), 
            'catalogs' => [
                'categories' => $this->businessCategoryRepository->all()
            ]
        ];
    }

    public function create(BusinessDTO $businessDTO)
    {
        return $this->businessRepository->create(
            $businessDTO->toArray()
        );
    }

    public function update(BusinessDTO $businessDTO, $idBusiness)
    {
        $business = $this->businessRepository->findById($idBusiness);
            
        return $business->update($businessDTO->toArray());
    }
}