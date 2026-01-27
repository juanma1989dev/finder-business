<?php 

namespace App\Services\Dashboard;

use App\DTOs\InfoGeneralDTO;
use App\Mappers\BusinessMapper; 
use App\Repositories\Contracts\AmenitiesRepositoryInterface;
use App\Repositories\Contracts\BusinessCategoryRepositoryInterface;
use App\Repositories\Contracts\BusinessRepositoryInterface;
use App\Repositories\Contracts\PaymentsRepositoryInterface;
use Illuminate\Support\Facades\DB;

class GeneralInfoService
{
    public function __construct(
        private BusinessRepositoryInterface $businessRepository, 
        private AmenitiesRepositoryInterface $amenitiesRepository,
        private PaymentsRepositoryInterface $paymentsRepository,
        private BusinessCategoryRepositoryInterface $businessCategoryRepository
    )
    {
    }

    public function getInfo($idBusiness) 
    {
        $business   = $this->businessRepository->findById($idBusiness, ['hours', 'category', 'amenities', 'payments']); 

        $amenities  = $this->amenitiesRepository->getAll();
        $payments   = $this->paymentsRepository->getAll();
        $categories = $this->businessCategoryRepository->where(['status' => true]);

        return  [
            'business'  => BusinessMapper::toArray($business),
            'amenities' => $amenities,
            'payments'  => $payments,
            'categories'  => $categories,
        ];
    }

    public function updateBusiness($idBusiness, InfoGeneralDTO $info)
    {
        return DB::transaction(function () use ($idBusiness, $info) {

            $infoData = $info->business->toArray(['user_id', 'location', 'cords']);

            $business = $this->businessRepository->update($idBusiness, $infoData);

            $this->businessRepository->syncAmenities(
                $idBusiness, 
                $info->amenities ?? []
            );

            $this->businessRepository->syncPayments(
                $idBusiness, 
                $info->payments ?? []
            );
            

            $this->businessRepository->updateSchedules(
                $idBusiness, 
                $info->schedules 
            );

            return $business;
        });
    }
}