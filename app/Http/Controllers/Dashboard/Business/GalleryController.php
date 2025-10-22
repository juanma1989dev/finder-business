<?php

namespace App\Http\Controllers\Dashboard\Business;

use App\Http\Controllers\Controller;
use App\Models\Businesses;
use App\Services\Dashboard\GalleryService;
use Illuminate\Http\Request;

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

    public function store(Request $request, string $businessId)
    {
        $validated = $request->validate([
            'images' => 'nullable|array',
            'images.*.file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:10240',
            'images.*.url' => 'nullable|string',
            'images.*.is_primary' => 'nullable|boolean',
        ]);

        $this->galleryService->syncGallery($businessId, $validated['images'] ?? null);

        return redirect()
            ->back()
            ->with('message', 'Galería sincronizada correctamente');
    }

}