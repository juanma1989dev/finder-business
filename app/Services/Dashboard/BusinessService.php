<?php 

namespace App\Services\Dashboard;

use App\DTOs\BusinessDTO;
use App\DTOs\CoverImageBusinessDTO;
use App\Models\BusinessCategory;
use App\Models\Businesses;
use App\Repositories\BusinessCategoryRepository;
use App\Repositories\BusinessRepository;
use Illuminate\Support\Facades\Storage;

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

    public function delete($idBusiness)
    {
        $business = $this->businessRepository->findById($idBusiness);
        return $business->delete();
    }

   public function updateCoverImage(string $idBusiness, CoverImageBusinessDTO $coverImage): bool
    {
        $business = $this->businessRepository->findById($idBusiness);

        $oldCoverImage = $business->cover_image;

        $path = Storage::disk('public')->putFileAs(
            "business_covers/{$idBusiness}", 
            $coverImage->tmpPath, 
            $coverImage->fileName
        );

        $business->update(['cover_image' => $path]);

        if($oldCoverImage) {
            Storage::disk('public')->delete($oldCoverImage);
        }

        return true;
    }

}