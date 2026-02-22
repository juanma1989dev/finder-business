<?php 

namespace App\Domains\Businesses\Services;

use App\Domains\Businesses\Dtos\NetworksDTO;
use App\Domains\Businesses\Repositories\Contracts\BusinessRepositoryInterface;

class NetworksService
{
    public function __construct(
        private BusinessRepositoryInterface $businessRepository
    )
    {
    }

    public function getData($id)
    {
        $business = $this->businessRepository->findById($id, ['socialNetworks', 'category']);

        return [
            'business' => $business,
        ];
    }

    public function update(NetworksDTO $networks, $id)
    {
        $data = $networks->toArray();

        $this->businessRepository->updateNetworks($id, $data);
    }
}
