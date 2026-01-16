<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CartController extends Controller
{
    public function store(Request $request)
    {
        $cart = $request->session()->get('cart', []);

        $itemData = $request->validate([
            'id' => 'required|integer',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'extras' => 'sometimes|array',
            'variations' => 'sometimes|array',
            'notes' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
        ]);

        $key = $this->buildKey($itemData);

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $itemData['quantity'];
        } else {
            $cart[$key] = [
                'key' => $key,
                'id' => $itemData['id'],
                'name' => $itemData['name'],
                'price' => $itemData['price'],
                'extras' => $itemData['extras'] ?? [],
                'variations' => $itemData['variations'] ?? [],
                'notes' => $itemData['notes'] ?? '',
                'quantity' => $itemData['quantity'],
            ];
        }

        $request->session()->put('cart', $cart);

        return Redirect::back();
    }

    public function update(Request $request, $key)
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$key])) {
            $validated = $request->validate([
                'quantity' => 'sometimes|integer',
                'notes' => 'sometimes|nullable|string',
            ]);

            if (isset($validated['quantity'])) {
                if ($validated['quantity'] > 0) {
                    $cart[$key]['quantity'] = $validated['quantity'];
                } else {
                    unset($cart[$key]);
                }
            }

            if (isset($validated['notes'])) {
                $cart[$key]['notes'] = $validated['notes'];
            }
        }

        $request->session()->put('cart', $cart);

        return Redirect::back();
    }

    public function destroy(Request $request, $key)
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$key])) {
            unset($cart[$key]);
        }

        $request->session()->put('cart', $cart);

        return Redirect::back();
    }

    private function buildKey(array $item): string
    {
        $extras = $item['extras'] ?? [];
        $variations = $item['variations'] ?? [];

        ksort($extras);
        ksort($variations);

        return sha1(
            $item['id'] .
            json_encode($extras) .
            json_encode($variations)
        );
    }

}
