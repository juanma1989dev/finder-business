<?php

namespace App\Http\Middleware;

use App\Domains\Orders\Flows\OrderFlow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()
            ? $request->user()->load([
                'deliveryProfile.status',
                'fcmTokens'
            ])
            : null
        ;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'cart' => $request->session()->get('cart', []),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'info'    => $request->session()->get('info'),
                'meta'    => $request->session()->get('meta', []),  
            ],
            'orderStatus' => $this->getFlow()
        ];
    }

    /**
     * 
     */
    private function getFlow()
    {
        $typeUser = Auth::user()->type ?? null;

        $data = [
            'flow' => OrderFlow::flow()[$typeUser] ?? [12],
            'labels' => OrderFlow::labels(),
        ];

        return $data;
    }
}
