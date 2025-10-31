<?php 

namespace App\Services\Dashboard;

use App\DTOs\NetworksDTO;
use App\Models\Businesses;
use App\Repositories\BusinessRepository;
use Illuminate\Http\Request;

class NetworksService
{
    public function __construct(
        private BusinessRepository $businessRepository
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