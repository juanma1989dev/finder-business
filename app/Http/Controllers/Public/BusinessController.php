<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\BusinessSearchRequest;
use App\Http\Requests\Public\SetFavoriteRequest;
use App\Models\User;
use App\Services\Public\SearchService;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

final class BusinessController extends Controller
{
    public function __construct(
        private readonly SearchService $searchService
    ) {}

    /**
     * Página principal con búsqueda de negocios
     */
    public function index(BusinessSearchRequest $request): Response
    {
        $data = $this->searchService->getData($request);

        $user = Auth::user()->id ?? null;
        $user = User::find($user);

        return inertia('Index', [
            ...$data,
            'activeOrder' => $user->activeOrder ?? null
        ]);
    }

    /**
     * Detalles de un negocio específico
     */
    public function details(string $slug, string $id): Response
    {
        $data = $this->searchService->getBusinessDetails($id, Auth::id());

        return inertia('public/business/detail', $data);
    }

    /**
     * Lista de negocios favoritos del usuario autenticado
     */
    public function favorites(): Response
    {
        return inertia('public/Favorites', [
            'businesses' => $this->searchService->getFavoritesByUser(Auth::id()),
        ]);
    }

    /**
     * Marcar/desmarcar negocio como favorito
     */
    public function setFavorite(SetFavoriteRequest $request)
    {
        $validated = $request->validated();

        $success = $this->searchService->setFavorite(
            userId: $request->user()->id,
            businessId: $validated['id_business'],
            isFavorite: $validated['favorite']
        );

        if ($request->wantsJson()) {
            return response()->json([
                'success' => $success,
                'favorite' => $validated['favorite'],
                'message' => $validated['favorite'] 
                    ? 'Negocio agregado a favoritos' 
                    : 'Negocio removido de favoritos'
            ]);
        }

        return back()->with('meta', [
            'favorite' => $validated['favorite'],
            'success' => $success,
        ]);
    }

    // /**
    //  * API de autocompletado para búsqueda en tiempo real
    //  */
    // public function autocomplete(BusinessSearchRequest $request): JsonResponse
    // {
    //     $query = $request->input('q', '');
        
    //     if (strlen($query) < 2) {
    //         return response()->json([]);
    //     }

    //     $geoData = $request->geo();
        
    //     $results = $this->searchService->autocomplete($query, $geoData);

    //     return response()->json($results);
    // }

    // /**
    //  * Obtener estadísticas de búsqueda (útil para analytics)
    //  */
    // public function searchStats(BusinessSearchRequest $request): JsonResponse
    // {
    //     $filters = $request->filters();
    //     $geoData = $request->geo();

    //     $stats = $this->searchService->getSearchStats($filters, $geoData);

    //     return response()->json($stats);
    // }
}