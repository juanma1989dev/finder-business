import { Business, ServicesAndProducts, SharedData } from '@/types';
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
            <section className="mb-8">
                {business.products?.length ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {business.products.map((product) => {
                            const quantity = getQuantity(product.id!);
                            return (
                                <div
                                    key={product.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-orange-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-50">
                                                <PackageSearch className="h-10 w-10 text-gray-200" />
                                            </div>
                                        )}

                                        {quantity > 0 && (
                                            <div className="absolute top-4 right-4 flex h-7 min-w-[28px] items-center justify-center rounded-lg bg-orange-500 px-2 text-[11px] font-black text-white shadow-lg ring-2">
                                                {quantity}
                                            </div>
                                        )}
                                    </div>

                                    {/* INFO DEL PRODUCTO */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="mb-4 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-[15px] leading-tight font-black text-gray-900 uppercase transition-colors group-hover:text-orange-500">
                                                    {product.name}
                                                </h3>
                                            </div>
                                            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed font-medium text-gray-400">
                                                {product.description ||
                                                    'Nuestra receta especial preparada al momento.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                    Precio
                                                </span>
                                                <span className="text-[11px] font-black text-gray-900">
                                                    ${product.price}
                                                </span>
                                            </div>

                                            {user && (
                                                <button
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            product,
                                                        )
                                                    }
                                                    className={`group/btn flex items-center gap-2 rounded-xl px-2 py-1 text-[10px] font-black uppercase shadow-lg ${
                                                        quantity === 0
                                                            ? 'bg-orange-500 text-white shadow-orange-100 hover:bg-orange-600'
                                                            : 'bg-purple-600 text-white shadow-purple-100 hover:bg-purple-700'
                                                    }`}
                                                >
                                                    <Plus
                                                        className={`h-3.5 w-3.5 transition-transform ${quantity > 0 ? 'rotate-90' : ''}`}
                                                    />
                                                    {quantity === 0
                                                        ? 'Agregar'
                                                        : `Llevar otro`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-20 text-center">
                        <div className="mb-4 rounded-xl bg-white p-5 text-gray-200 shadow-sm">
                            <PackageSearch size={40} />
                        </div>
                        <h3 className="text-sm font-black text-gray-400 uppercase">
                            Sin productos registrados
                        </h3>
                        <p className="mt-1 text-[11px] font-bold tracking-widest text-gray-300 uppercase">
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
