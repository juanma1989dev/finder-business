<?php

namespace App\Http\Controllers\App\Business;

use App\Domains\Businesses\Dtos\GalleryBusinessDTO;
use App\Domains\Businesses\Dtos\ImageBusinessDTO;
use App\Http\Controllers\Controller;
use App\Domains\Businesses\Services\GalleryService;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function __construct(
        private GalleryService $galleryService
    ) {}

    public function index($idBusiness)
    {
        $data = $this->galleryService->getData($idBusiness);

        return inertia('Business/Gallery', $data);
    }

    public function store(Request $request, string $businessId, string $slug)
    {
        $gallery = GalleryBusinessDTO::fromArray( $request );

        $this->galleryService->syncGallery($businessId, $gallery);


        return redirect()
            ->back()
            ->with('message', 'Galería sincronizada correctamente');
    }

}