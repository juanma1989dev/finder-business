<?php 

namespace App\Services\Dashboard;

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

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'web' => 'nullable|url',
            'instagram' => 'nullable|url',
            'youtube' => 'nullable|url',
            'facebook' => 'nullable|url',
            'tiktok' => 'nullable|url',
            'twitter' => 'nullable|url',
        ]);

        $this->businessRepository->updateNetworks($id, $data);
    }
}