import { useCartStore } from '@/store/cart.store';
import { Business, ServicesAndProducts } from '@/types';

interface Props {
    business: Business;
}

export const ProductsBussinessTab = ({ business }: Props) => {
    const { addItem, increment, decrement } = useCartStore();
    const cartItems = useCartStore((state) => state.items);

    const getQuantity = (productId: string | number) => {
        return (
            cartItems.find((item) => item.id === String(productId))?.quantity ??
            0
        );
    };

    const addProductToCar = (product: ServicesAndProducts) => {
        addItem({
            id: product.id ?? '',
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1,
        });
    };

    return (
        <div className="container mx-auto px-1 py-2">
            <section className="mb-8">
                {business.products && business.products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {business.products.map((product: any) => {
                            const quantity = getQuantity(product.id);

                            return (
                                <div className="relative flex h-full flex-col gap-3 rounded-xl bg-white p-3 shadow-sm md:flex-row">
                                    {/* Badge */}
                                    <span className="absolute top-3 left-3 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                        Popular
                                    </span>

                                    {/* Imagen */}
                                    <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg bg-gray-100 md:mb-0 md:ml-3 md:h-24 md:w-24">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />

                                        {/* Overlay sin stock */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                                            Sin stock
                                        </div>
                                    </div>

                                    {/* Info + acciones */}
                                    <div className="flex flex-1 flex-col">
                                        {/* Info */}
                                        <div>
                                            <h3 className="text-sm leading-snug font-semibold text-gray-900">
                                                {product.name}
                                            </h3>

                                            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                                                {product.description}
                                            </p>

                                            <span className="mt-2 block text-base font-bold text-gray-900">
                                                ${product.price}
                                            </span>
                                        </div>

                                        {/* Variantes */}
                                        <div className="mt-3 space-y-2">
                                            {/* Tamaños */}
                                            {/* <div>
                                                                        <p className="mb-1 text-[11px] font-medium text-gray-600">
                                                                            Tamaño
                                                                        </p>
                                                                        <div className="flex gap-2">
                                                                            <button className="rounded-md border px-2 py-1 text-xs">
                                                                                Chico
                                                                            </button>
                                                                            <button className="rounded-md border border-green-600 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                                                                                Mediano
                                                                            </button>
                                                                            <button className="rounded-md border px-2 py-1 text-xs">
                                                                                Grande
                                                                            </button>
                                                                        </div>
                                                                    </div> */}

                                            {/* Extras */}
                                            {/* <div>
                                                                        <p className="mb-1 text-[11px] font-medium text-gray-600">
                                                                            Extras
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                                                                                🧀
                                                                                Queso
                                                                            </span>
                                                                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                                                                                🌶️
                                                                                Picante
                                                                            </span>
                                                                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                                                                                🥓
                                                                                Tocino
                                                                            </span>
                                                                        </div>
                                                                    </div> */}
                                        </div>

                                        {/* Acción */}
                                        <div className="mt-auto w-full pt-4">
                                            {quantity === 0 ? (
                                                // BOTÓN AGREGAR
                                                <button
                                                    onClick={() =>
                                                        addProductToCar(product)
                                                    }
                                                    className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
                                                >
                                                    + Agregar
                                                </button>
                                            ) : (
                                                // STEPPER
                                                <div className="flex w-full items-center justify-between rounded-lg border border-green-600 bg-green-50 px-3 py-2">
                                                    <button
                                                        onClick={() =>
                                                            decrement(
                                                                product.id,
                                                            )
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-600 shadow active:scale-95"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="text-sm font-semibold text-green-700">
                                                        ✓ Agregado ({quantity})
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            increment(
                                                                product.id,
                                                            )
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white shadow active:scale-95"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center rounded-lg bg-gray-50/80 p-6 text-gray-600">
                        No hay productos disponibles por el momento.
                    </div>
                )}
            </section>
        </div>
    );
};
