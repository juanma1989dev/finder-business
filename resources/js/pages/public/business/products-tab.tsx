import { useCartStore } from '@/store/cart.store';
import { Business, ServicesAndProducts, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ProductConfigModal } from './ProductConfigModal';

interface Props {
    business: Business;
}

export const ProductsBussinessTab = ({ business }: Props) => {
    const addItem = useCartStore((s) => s.addItem);
    const cartItems = useCartStore((s) => s.items);

    const [selectedProduct, setSelectedProduct] =
        useState<ServicesAndProducts | null>(null);

    /**
     * Cantidad TOTAL del producto
     * (suma todas las combinaciones)
     */
    const getQuantity = (productId: string | number) => {
        return cartItems
            .filter((item) => item.id === productId)
            .reduce((sum, item) => sum + item.quantity, 0);
    };

    const addConfiguredProduct = (
        product: ServicesAndProducts,
        config: {
            extras: any[];
            variations: any[];
            notes: string;
        },
    ) => {
        addItem({
            id: product.id!,
            name: product.name,
            price: product.price,
            extras: config.extras,
            variations: config.variations,
            notes: config.notes,
            quantity: 1,
        });
    };

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <div className="container mx-auto px-1 py-2">
            <section className="mb-8">
                {business.products?.length ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {business.products.map((product) => {
                            const quantity = getQuantity(product.id!);
                            return (
                                <div
                                    key={product.id}
                                    className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                                >
                                    {/* IMAGEN */}
                                    <div className="mb-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-300">
                                                Sin imagen
                                            </span>
                                        )}
                                    </div>

                                    {/* CONTENIDO */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                {product.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                                {product.description || '—'}
                                            </p>
                                        </div>

                                        {/* PRECIO + BOTÓN */}
                                        {user && (
                                            <div className="mt-3 flex flex-col gap-2">
                                                <span className="text-base font-bold text-gray-900">
                                                    ${product.price}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            product,
                                                        )
                                                    }
                                                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
                                                >
                                                    {quantity === 0
                                                        ? '+ Agregar'
                                                        : `Agregar otro (${quantity})`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mb-3 h-12 w-12 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h18v18H3V3z"
                            />
                        </svg>
                        <span>
                            No hay productos disponibles por el momento.
                        </span>
                    </div>
                )}
            </section>

            {/* MODAL CONFIGURACIÓN */}
            {selectedProduct && (
                <ProductConfigModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onConfirm={(config) => {
                        addConfiguredProduct(selectedProduct, config);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
};
