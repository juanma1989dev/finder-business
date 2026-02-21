<?php

namespace App\Services\Notifications;

use App\Domains\Users\Models\User;
use App\Services\FcmNotificationService;

class PushNotificationService
{
    public function __construct(
        private FcmNotificationService $fcm
    ) {}

    public function notify(
        $tokens,
        string $title,
        string $body,
        array $extra = []
    ): void {

        if (empty($tokens)) {
            return;
        }

        $payload = $this->buildPayload($title, $body, $extra);

        $this->fcm->send($payload, $tokens);
    }
    private function buildPayload(
        string $title,
        string $body,
        array $extra
    ): array {
        return array_merge([
            'type'    => 'push',
            'title'   => $title,
            'body'    => $body,
        ], $extra);
    }
}
