<?php

namespace App\Domains\Users\Actions;

use App\Domains\Users\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterUserAction
{
    public function execute(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => isset($data['password']) ? Hash::make($data['password']) : null,
            'google_id' => $data['google_id'] ?? null,
            'type' => $data['type'] ?? null,
            'privacy_accepted' => $data['privacy_accepted'] ?? false,
            'privacy_version' => $data['privacy_version'] ?? null,
            'privacy_accepted_at' => $data['privacy_accepted_at'] ?? null,
            'email_verified_at' => $data['email_verified_at'] ?? null,
        ]);
    }
}
