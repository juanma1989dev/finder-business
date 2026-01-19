<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderManagementController extends Controller
{
    public function updateStatus( Request $request, Order $order)
    {
        // dd(  $request->input('status')  );

        $current    = $order->status;
        $nextStatus =  $this->getNextStatus($current, $request);

        if (!$nextStatus) {
            return back()->with('error', 'No hay estado siguiente válido');
        }

        $order->update([
            'status' => $nextStatus,
        ]);

        return back()->with('success', 'Pedido actualizado');
    }

    private function getNextStatus(string $current, Request $request): string
    {

        $status = $request->input('status', null);
        
        if($status){
            return OrderStatusEnum::fromValue($status);
        }

        $flow = OrderStatusEnum::flow();

        // if (! isset($flow[$current]) || empty($flow[$current])) {
        //     return back()->with('error', 'El pedido no puede avanzar');
        // }

        $nextStatus = collect($flow[$current])
            ->first(fn ($s) => ! in_array($s, [
                OrderStatusEnum::CANCELLED->value,
                OrderStatusEnum::REJECTED->value,
            ]));

        return $nextStatus;
    }


    private function canTransition(string $from, string $to): bool
    {

        // $flow = [
        //     'pending' => ['confirmed', 'cancelled', 'rejected'],
        //     'confirmed' => ['on_the_way', 'cancelled'],
        //     'on_the_way' => ['delivered'],
        // ];

        $flow = OrderStatusEnum::flow();


        return in_array($to, $flow[$from] ?? []);
    }



    // public function updateStatus(Request $request, Order $order)
    // {
    //     $request->validate([
    //         'status' => ['required', Rule::in(array_column(OrderStatusEnum::cases(), 'value'))],
    //     ]);

    //     $order->status = $request->status;
    //     $order->save();

    //     return response()->json(['success' => true]);
    // }


}
