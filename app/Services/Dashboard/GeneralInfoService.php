<?php 

namespace App\Services\Dashboard;

use App\Mappers\BusinessMapper;
use App\Repositories\AmenitiesRepository;
use App\Repositories\BusinessCategoryRepository;
use App\Repositories\BusinessRepository;
use App\Repositories\PaymentsRepository;
use Illuminate\Support\Facades\DB;

class GeneralInfoService
{
    public function __construct(
        private BusinessRepository $businessRepository, 
        private AmenitiesRepository $amenitiesRepository,
        private PaymentsRepository $paymentsRepository,
        private BusinessCategoryRepository $businessCategoryRepository
    )
    {
    }

    // // $daysOfWeek = DayOfWeek::toOptions();
    public function getInfo($idBusiness) 
    {
        $business   = $this->businessRepository->findById($idBusiness, ['hours', 'category', 'services', 'payments']) ;
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

    public function updateBusiness($idBusiness, $request)
    {
        return DB::transaction(function () use ($idBusiness, $request) {

            $dataBusiness = $request->validated();

            $business = $this->businessRepository->update(
                $idBusiness, 
                $dataBusiness
            );

            $this->businessRepository->syncServices(
                $idBusiness, 
                $request->amenities ?? []
            );

            $this->businessRepository->syncPayments(
                $idBusiness, 
                $request->payments ?? []
            );

            $this->businessRepository->updateSchedules(
                $idBusiness, 
                $request->schedules ?? []
            );

            return $business;
        });
    }
}