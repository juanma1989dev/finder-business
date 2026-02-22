<?php 

namespace App\Domains\Users\Services;

use App\Domains\Users\Models\FcmToken;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\MulticastSendReport;
use Throwable;

class FcmNotificationService 
{
    private const TOKEN_NOT_REGISTERED = 'messaging/registration-token-not-registered';

    public function send(array $data = [], array $tokens) : void
    {
        if(empty($tokens)){
            return;
        }

        $message = CloudMessage::new()->withData($data);

        try {
            $report = app('firebase.messaging')->sendMulticast($message, $tokens);
            $this->handleFailures($report);
        } catch (Throwable  $e) {
            Log::error("Error en envío multicast: " . $e->getMessage());
        }         
    }

    private function handleFailures(MulticastSendReport $report): void
    {
        foreach($report->failures()->getItems() as $failure){
            $error = $failure->error();

            if($error->getCode() === self::TOKEN_NOT_REGISTERED){
                FcmToken::where('token', $failure->target()->value())->delete();

                Log::warning("Token inválido eliminado: " . $failure->target()->value());
            }
        }
    }
}
