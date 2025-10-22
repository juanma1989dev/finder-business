<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

final class BusinessSearchRequest extends FormRequest
{

    /**
     * Autoriza la petición
     */
    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        return [
            'q' => 'nullable|string|max:255',
            'category' => 'nullable|string', 
            'distance' => 'nullable|numeric|min:1',
        ];
    }

    /**
     * Devuelve solo los filtros válidos
     */
    public function filters(): array
    {
        return array_filter([
            'q' => $this->query('q'),
            'category' => $this->query('category'),
            'distance' => $this->query('distance'),
        ], fn($v) => $v !== null && $v !== '');
    }

    /**
     * Devuelve los datos de geolocalización
     */
    public function geo(): array
    {
        return [
            'lat' => $this->header('X-Latitude'),
            'long' => $this->header('X-Longitude'),
            'radius' => $this->input('distance', 5),
        ];
    }
}