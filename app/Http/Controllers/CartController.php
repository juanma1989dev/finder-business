<?php

namespace App\Http\Controllers;

use App\Models\BusinessProduct;
use App\Models\BusinessProductExtra;
use App\Models\BusinessProductVariation;
use App\Models\Product;
use App\Models\Extra;
use App\Models\Variation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CartController extends Controller
{
    public function store(Request $request)
    {

        $cart = $request->session()->get('cart', []);

        $validated = $request->validate([
            'id' => 'required|integer',
            'quantity' => 'required|integer|min:1',

            'extras' => 'sometimes|array',
            'extras.*.id' => 'required|integer',
            'extras.*.name' => 'required|string',
            'extras.*.price' => 'required|numeric',

            'variations' => 'sometimes|array',
            'variations.*.id' => 'required|integer',
            'variations.*.name' => 'required|string',

            'notes' => 'nullable|string',
        ]);
        
        $extraIds = collect($validated['extras'] ?? [])->pluck('id')->toArray();
        $variationIds = collect($validated['variations'] ?? [])->pluck('id')->toArray();

        $product    = BusinessProduct::findOrFail($validated['id']);
        $extras     = BusinessProductExtra::whereIn('id', $extraIds)->get();
        $variations = BusinessProductVariation::whereIn('id', $variationIds)->get();

        $item = [
            'id' => $product->id,
            'businesses_id' => $product->businesses_id,
            'name' => $product->name,
            'price' => $product->price, 
            'extras' => $extras->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'price' => $e->price,
            ])->values()->toArray(),
            'variations' => $variations->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'price' => $v->price,
            ])->values()->toArray(),
            'notes' => $validated['notes'] ?? null,
            'quantity' => $validated['quantity'],
        ];

        $key = $this->buildKey($item);

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $item['quantity'];
        } else {
            $item['key'] = $key;
            $cart[$key] = $item;
        }

        $request->session()->put('cart', $cart);

           

        return Redirect::back();
    }

    public function update(Request $request, $key)
    {
        $cart = $request->session()->get('cart', []);

        if (!isset($cart[$key])) {
            return Redirect::back();
        }

        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'notes' => 'sometimes|nullable|string',
        ]);

        if (isset($validated['quantity'])) {
            $cart[$key]['quantity'] = $validated['quantity'];
        }

        if (array_key_exists('notes', $validated)) {
            $cart[$key]['notes'] = $validated['notes'];
        }

        $request->session()->put('cart', $cart);

        return Redirect::back();
    }

    public function destroy(Request $request, $key)
    {
        $cart = $request->session()->get('cart', []);

        unset($cart[$key]);

        $request->session()->put('cart', $cart);

        return Redirect::back();
    }

    private function buildKey(array $item): string
    {
        $extras = collect($item['extras'])->pluck('id')->sort()->values();
        $variations = collect($item['variations'])->pluck('id')->sort()->values();

        return sha1(
            $item['id'] .
            json_encode($extras) .
            json_encode($variations)
        );
    }
}
