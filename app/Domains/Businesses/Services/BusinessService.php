<?php 

namespace App\Domains\Businesses\Services;

use App\Domains\Businesses\Dtos\BusinessDTO;
use App\Domains\Businesses\Dtos\CoverImageBusinessDTO;
use App\Domains\Businesses\Models\Business;
use App\Domains\Businesses\Repositories\Contracts\BusinessCategoryRepositoryInterface;
use App\Domains\Businesses\Repositories\Contracts\BusinessRepositoryInterface;
use Illuminate\Support\Facades\Storage;

class BusinessService
{
    public function __construct(
        private readonly BusinessRepositoryInterface $businessRepository,
        private readonly BusinessCategoryRepositoryInterface $businessCategoryRepository
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
        $data = $businessDTO->toSave();

        return $this->businessRepository->create( $data );
    }

    public function createBusiness(BusinessDTO $dto): Business
    {
        return $this->businessRepository->store($dto->toArray());
    }        
    public function update(BusinessDTO $businessDTO, $idBusiness)
    {
        $business = $this->businessRepository->findById($idBusiness);
            
        return $business->update($businessDTO->toSave());
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

    public function manageOpening(array $data)
    {
        $model = Business::query();
        
        $business = $model->findOrFail($data['id']);
        $business->update(['is_open' => $data['status']]);
    }
}