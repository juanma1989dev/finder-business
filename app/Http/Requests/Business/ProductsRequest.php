<?php

namespace App\Http\Requests\Business;

use Illuminate\Foundation\Http\FormRequest;

class ProductsRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|gt:0',
            'duration'    => 'nullable|string|max:255',
            'category'    => 'required|string',
            'isActive'    => 'required|boolean',
            "image"       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', 
        ];
    }
}
