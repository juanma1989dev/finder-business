<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\DTOs\GalleryBusinessDTO;
use App\DTOs\GalleryImagesDTO;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\GalleryService;

class GalleryController extends Controller
{
    public function __construct(
        private GalleryService $galleryService
    ) {}

    public function index($idBusiness)
    {
        $data = $this->galleryService->getData($idBusiness);

        return inertia('admin/Business/Gallery', $data);
    }

    public function store(string $businessId)
    {
        $gallery = GalleryBusinessDTO::fromArray( request() );

        $this->galleryService->syncGallery($businessId, $gallery);

        return redirect()
            ->back()
            ->with('message', 'Galería sincronizada correctamente');
    }

}