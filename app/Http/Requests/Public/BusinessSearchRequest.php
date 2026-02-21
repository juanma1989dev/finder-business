<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class BusinessSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;  
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'distance' => ['nullable', 'integer', 'min:1', 'max:100'], // Radio máximo 100 KM
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'q' => 'búsqueda',
            'category' => 'categoría',
            'distance' => 'distancia',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'q.max' => 'La búsqueda no puede exceder :max caracteres.',
            'category.max' => 'La categoría no puede exceder :max caracteres.',
            'distance.integer' => 'La distancia debe ser un número entero.',
            'distance.min' => 'La distancia mínima es :min kilómetro.',
            'distance.max' => 'La distancia máxima es :max kilómetros.',
        ];
    }

    /**
     * Obtener filtros validados y limpios
     */
    public function filters(): array
    {
        return [
            'q' => $this->input('q') ? trim($this->input('q')) : null,
            'category' => $this->input('category') ? trim($this->input('category')) : null,
            'distance' => $this->input('distance') ? (int) $this->input('distance') : null,
            'foodType' => $this->input('foodType') ? (int) $this->input('foodType') : null,
        ];
    }

    /**
     * Obtener datos de geolocalización desde headers
     */
    public function geo(): array
    {
        // Priorizar headers (enviados desde el frontend con geolocalización)
        $latHeader = $this->header('X-Latitude');
        $lngHeader = $this->header('X-Longitude');

        // Fallback: obtener de query params (útil para testing)
        $latQuery = $this->input('lat');
        $lngQuery = $this->input('lng');

        $lat = $latHeader ?? $latQuery;
        $lng = $lngHeader ?? $lngQuery;

        // Validar que sean coordenadas válidas
        if ($lat && $lng) {
            $lat = (float) $lat;
            $lng = (float) $lng;

            // Validación básica de rangos de coordenadas
            if ($this->isValidCoordinate($lat, $lng)) {
                return [
                    'lat' => $lat,
                    'long' => $lng,
                ];
            }
        }

        return [
            'lat' => null,
            'long' => null,
        ];
    }

    /**
     * Validar si las coordenadas están dentro de rangos válidos
     */
    private function isValidCoordinate(float $lat, float $lng): bool
    {
        // Latitud: -90 a 90
        // Longitud: -180 a 180
        return $lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180;
    }

    /**
     * Verificar si la búsqueda tiene geolocalización
     */
    public function hasGeolocation(): bool
    {
        $geo = $this->geo();
        return !empty($geo['lat']) && !empty($geo['long']);
    }
}