import { Business, ServicesAndProducts, SharedData, TypeUser } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { PackageSearch, Plus } from 'lucide-react';
import { useState } from 'react';
import { ProductConfigModal } from './ProductConfigModal';

interface Props {
    business: Business;
}

export const ProductsBussinessTab = ({ business }: Props) => {
    const { auth, cart } = usePage<SharedData>().props;
    const user = auth.user;

    const [selectedProduct, setSelectedProduct] =
        useState<ServicesAndProducts | null>(null);

    const getQuantity = (productId: string | number) => {
        return Object.values(cart)
            .filter((item) => item.id === productId)
            .reduce((sum, item) => sum + item.quantity, 0);
    };

    const addConfiguredProduct = (
        product: ServicesAndProducts,
        config: { extras: any[]; variations: any[]; notes: string },
    ) => {
        const itemData = {
            id: product.id!,
            businesses_id: product.businesses_id,
            name: product.name,
            price: product.price,
            extras: config.extras,
            variations: config.variations,
            notes: config.notes,
            quantity: 1,
        };

        router.post('/cart', itemData, {
            preserveScroll: true,
        });
    };

    return (
        <div className="w-full py-2">
            <section className="mb-4">
                {business.products?.length ? (
                    /* CONFIGURACIÓN DE GRILLA RESPONSIVA */
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {business.products.map((product) => {
                            const quantity = getQuantity(product.id!);
                            return (
                                <div
                                    key={product.id}
                                    /* ESPACIADO, ESTRUCTURA Y SOMBRA */
                                    className="group flex flex-col overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm transition-all duration-300"
                                >
                                    <div className="relative h-48 w-full overflow-hidden bg-purple-50">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <PackageSearch className="h-10 w-10 text-gray-300" />
                                            </div>
                                        )}

                                        {quantity > 0 && (
                                            <div className="absolute top-4 right-4 flex h-7 min-w-[28px] animate-pulse items-center justify-center rounded-lg bg-purple-600 px-2 text-[10px] font-semibold text-white shadow-lg">
                                                {quantity}
                                            </div>
                                        )}
                                    </div>

                                    {/* INFO DEL PRODUCTO - Padding p-3 */}
                                    <div className="flex flex-1 flex-col p-3">
                                        <div className="mb-3 flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm leading-tight font-semibold text-purple-800">
                                                    {product.name}
                                                </h3>
                                            </div>
                                            <p className="line-clamp-2 text-[10px] leading-tight font-normal text-gray-600">
                                                {product.description ||
                                                    'Nuestra receta especial preparada al momento.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-purple-50 pt-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] leading-tight font-semibold text-gray-500 uppercase">
                                                    Precio
                                                </span>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    ${product.price}
                                                </span>
                                            </div>

                                            {(user.type === TypeUser.CLIENT  && (
                                                <button
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            product,
                                                        )
                                                    }
                                                    /* BOTÓN PRIMARIO Y EFECTO PULSACIÓN */
                                                    className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    <span>
                                                        {quantity === 0
                                                            ? 'Agregar'
                                                            : 'Otro'}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ESTADO VACÍO - Paleta Gris */
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-purple-50 py-20 text-center">
                        <div className="mb-4 rounded-lg bg-white p-3 text-gray-300 shadow-sm">
                            <PackageSearch size={40} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700">
                            Sin productos registrados
                        </h3>
                        <p className="mt-1 text-[10px] leading-tight font-normal tracking-wider text-gray-500 uppercase">
                            Vuelve pronto para ver novedades
                        </p>
                    </div>
                )}
            </section>

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
