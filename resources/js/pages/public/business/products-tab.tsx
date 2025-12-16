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
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {business.products.map(
                            (product: ServicesAndProducts) => {
                                const quantity = getQuantity(product.id!);

                                return (
                                    <div
                                        key={product.id}
                                        className="relative flex h-full flex-col gap-3 rounded-xl bg-white p-3 shadow-sm md:flex-row"
                                    >
                                        {/* IMAGEN */}
                                        <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg bg-gray-100 md:mb-0 md:ml-3 md:h-24 md:w-24">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* INFO */}
                                        <div className="flex flex-1 flex-col">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {product.name}
                                                </h3>

                                                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                                                    {product.description}
                                                </p>

                                                <span className="mt-2 block text-base font-bold text-gray-900">
                                                    ${product.price}
                                                </span>
                                            </div>

                                            {/* ACCIÓN */}
                                            {user && false && (
                                                <div className="mt-auto w-full pt-4">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedProduct(
                                                                product,
                                                            )
                                                        }
                                                        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
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
                            },
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center rounded-lg bg-gray-50/80 p-6 text-gray-600">
                        No hay productos disponibles por el momento.
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
