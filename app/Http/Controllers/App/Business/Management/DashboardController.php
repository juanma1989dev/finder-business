<?php

namespace App\Http\Controllers\App\Business\Management;

use App\Domains\Orders\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Domains\Businesses\Models\Business;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(int $businessId, string $slug)
    {
        $business = Business::query()
            ->where('id', $businessId)
            ->where('user_id', Auth::id())
            ->where('slug', $slug)
            ->first();

        if (! $business) {
            abort(404, 'El negocio no existe o no te pertenece.');
        }

        $orders = $business->orders()
            ->whereNotIn('status',  [OrderStatusEnum::CANCELLED, OrderStatusEnum::REJECTED])
            ->whereDate('created_at', now())
            ->with(['items', 'user'])
            ->latest()
            ->limit(30)  
            ->get();

        return inertia('Business/Management/Dashboard', [
            'business' => $business,
            'orders' => $orders,
            'final_statuses' => OrderStatusEnum::finalStatuses(),
        ]);
    }
}