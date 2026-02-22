<?php 

namespace App\Domains\Businesses\Dtos;

use App\Domains\Businesses\Dtos\Traits\ArrayableDTO;
use Illuminate\Http\Request;

class NetworksDTO
{
    use ArrayableDTO;

    public function __construct(
        public readonly ?string $web,
        public readonly ?string $instagram,
        public readonly ?string $youtube,
        public readonly ?string $facebook,
        public readonly ?string $tiktok,
        public readonly ?string $twitter
    )
    {        
    }

    public static function fromRequest(Request $request): self
    {
        $data = $request->validate([
            'web' => 'nullable|url',
            'instagram' => 'nullable|url',
            'youtube' => 'nullable|url',
            'facebook' => 'nullable|url',
            'tiktok' => 'nullable|url',
            'twitter' => 'nullable|url',
        ]);

        return new self(
            $data['web'],
            $data['instagram'],
            $data['youtube'],
            $data['facebook'],
            $data['tiktok'],
            $data['twitter']
        );
    }
}
