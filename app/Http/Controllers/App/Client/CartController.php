<?php

namespace App\Http\Controllers\App\Client;

use App\Domains\Businesses\Models\BusinessProduct;
use App\Domains\Businesses\Models\BusinessProductExtra;
use App\Domains\Businesses\Models\BusinessProductVariation;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Redirect;

class StoreCartItemRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => 'required|integer',
            'quantity' => 'required|integer|min:1',

            'extras' => 'sometimes|array',
            'extras.*.id' => 'required|integer',

            'variations' => 'sometimes|array',
            'variations.*.id' => 'required|integer',

            'notes' => 'nullable|string',
        ];
    }
}

class CartService
{
    public function add(array $item, $request): void
    {
        $cart = $request->session()->get('cart', []);

        $key = $this->buildKey($item);

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $item['quantity'];
        } else {
            $item['key'] = $key;
            $cart[$key] = $item;
        }

        $request->session()->put('cart', $cart);
    }

    public function update(string $key, int $quantity, $request): void
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$key])) {
            if ($quantity <= 0) {
                unset($cart[$key]);
            } else {
                $cart[$key]['quantity'] = $quantity;
            }
        }

        $request->session()->put('cart', $cart);
    }

    public function remove(string $key, $request): void
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$key])) {
            unset($cart[$key]);
        }

        $request->session()->put('cart', $cart);
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

class BuildCartItem
{
    public function execute(array $validated): array
    {
        $extraIds = collect($validated['extras'] ?? [])->pluck('id');
        $variationIds = collect($validated['variations'] ?? [])->pluck('id');

        $product = BusinessProduct::findOrFail($validated['id']);

        $extras = BusinessProductExtra::whereIn('id', $extraIds)->get();
        $variations = BusinessProductVariation::whereIn('id', $variationIds)->get();

        return [
            'id' => $product->id,
            'business_id' => $product->business_id,
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
    }
}

class CartController extends Controller
{
    public function store(
        StoreCartItemRequest $request,
        BuildCartItem $builder,
        CartService $cartService
    ) {
        $item = $builder->execute($request->validated());

        $cartService->add($item, $request);

        return Redirect::back();
    }

    public function update($key, \Illuminate\Http\Request $request, CartService $cartService)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $cartService->update($key, $request->quantity, $request);

        return Redirect::back();
    }

    public function destroy($key, \Illuminate\Http\Request $request, CartService $cartService)
    {
        $cartService->remove($key, $request);

        return Redirect::back();
    }
}