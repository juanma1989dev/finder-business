<?php

namespace App\Http\Controllers\App\Business;

use App\Domains\Orders\Actions\UpdateOrderStatusAction;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderManagementController extends Controller
{
    public function __construct(
        private UpdateOrderStatusAction $updateOrderStatusAction
    )
    {
    }

    public function updateStatus( Request $request, Order $order)
    {
        try {
            $this->updateOrderStatusAction->execute(
                order : $order,
                nextStatus: strtolower($request->input('status')),
                note: $request->input('note'),
                actor: $request->user()
            );
            
            return back()->with('success', 'Pedido actualizado');
        } catch (\DomainException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // private function generateCode(): string
    // {
    //    return str_pad(
    //         random_int(0, 99999),
    //         5,
    //         '0',
    //         STR_PAD_LEFT
    //     );
    // }
}
