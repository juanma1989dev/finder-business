<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class SetFavoriteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null; // Solo usuarios autenticados
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'id_business' => ['required'],
            'favorite' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'id_business' => 'negocio',
            'favorite' => 'favorito',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'id_business.required' => 'El ID del negocio es requerido.',
            'id_business.exists' => 'El negocio seleccionado no existe.',
            'favorite.required' => 'Debes especificar si es favorito o no.',
            'favorite.boolean' => 'El valor de favorito debe ser verdadero o falso.',
        ];
    }
}