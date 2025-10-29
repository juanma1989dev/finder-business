<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\BusinessSearchRequest;
use App\Services\Public\SearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class BusinessController extends Controller
{
    public function __construct(
        private readonly SearchService $searchService
    ) {}

    public function index(BusinessSearchRequest $request)
    {
        $filters = $request->filters();
        $geoData = $request->geo();

        // dd($geoData);

        $data = $this->searchService->getData($filters, $geoData);

        return inertia('Index', [
            ...$data,
            'filters' => $filters,
        ]);
    }

    public function details(string $id)
    {
        return inertia('public/business/detail', $this->searchService->getBusinessDetails($id, Auth::id()));
    }

    public function favorites()
    {
        return inertia('public/Favorites', [
            'businesses' => $this->searchService->getFavoritesByUser(Auth::id()),
        ]);
    }

    public function setFavorite(Request $request)
    {
        $this->searchService->setFavorite(
            userId: $request->user()->id,
            businessId: $request->input('id_business'),
            isFavorite: $request->boolean('favorite')
        );

        return back()->with('meta', ['favorite' => $request->boolean('favorite')]);
    }
}
