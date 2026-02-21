<?php

namespace App\Http\Requests\Business;

use Illuminate\Foundation\Http\FormRequest;

class InfoGeneralRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            "id_category" => ['required'], /// 'id_category' => ['required', 'integer', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'long_description' => ['required', 'string'],
            "address" => ['required'],
            "phone" => ['required', 'digits:10'],
            "use_whatsapp" => ['required'],
            "tags" => ['nullable'],
        ];
    }
}
