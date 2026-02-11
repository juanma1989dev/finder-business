<?php


require __DIR__.'/dashboard/index.php';
require __DIR__.'/public.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/delivery.php';

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\FcmTokenController;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Kreait\Firebase\Exception\Messaging\NotFound;
use Kreait\Firebase\Messaging\CloudMessage;

Route::post('/fcm/token', [FcmTokenController::class, 'store'])->middleware('auth');


// Route::get('/test/notify', function(){
//     $message = CloudMessage::fromArray([
//         'token' => 'eghp5_ALwNX4s1wB2Dj2r2:APA91bE_93pGsJ2oDu5RJa0BDwmwiDEX6jS2yVbkYaEeo9e8fXTBb1LEq_oy5h9Izp2oDDagbm0T6wUnB24NTRVG1ZomFDq_c45unNGpBiy2KuvUE40nN1I',
//         'data' => [
//             'title'    => '🚴 Nuevo pedido disponible',
//             'body'     => 'Pedido #99999999 en espera de repartidor',
//             'order_id' => '99999999',
//             'type'     => 'order_available',
//             'status'   => OrderStatusEnum::READY_FOR_PICKUP->value
//         ],
//     ]);
//     try {
//         app('firebase.messaging')->send($message);
//         dd('TEST');
//     } catch (NotFound $e) {
//         Log::warning("Token FCM no encontrado para el usuario  . Eliminado.");
//     } catch (Exception $e) {
//         Log::error("Fallo al enviar notificación FCM: " . $e->getMessage());
//     }
// });

// Route::get('/test/orders/delta', function(){
//     return Order::all();
// });