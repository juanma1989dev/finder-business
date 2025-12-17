import { useCartStore } from '@/store/cart.store';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: Props) => {
    const { items, increment, decrement, removeItem, getTotalPrice } =
        useCartStore();

    const handleRemoveItem = (key: string) => {
        removeItem(key);
        console.log('Deleted', items);
    };

    const totalPrice = getTotalPrice();

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div onClick={onClose} className="fixed inset-0 z-40 bg-black/60" />

            {/* Drawer */}
            <div className="fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
                <header className="flex justify-between border-b p-4">
                    <h2 className="font-semibold">Tu pedido</h2>
                    <button onClick={onClose}>✕</button>
                </header>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {items.map((item) => (
                        <div
                            key={item.key}
                            className="flex items-start justify-between rounded-lg border p-3"
                        >
                            {/* Info */}
                            <div className="flex-1">
                                <p className="mb-1 font-semibold">
                                    {item.name}{' '}
                                    {item.variations?.length > 0 ? ' - ' : ''}
                                    {item.variations?.length > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {item.variations
                                                .map((v: any) => v.name)
                                                .join(', ')}
                                        </span>
                                    )}
                                </p>

                                {/* Extras */}
                                {item.extras.length > 0 && (
                                    <>
                                        <span className="mt-2 mb-1 text-sm text-gray-700">
                                            Extras
                                        </span>
                                        <ul className="text-sm text-gray-500">
                                            {item.extras.map((e: any) => (
                                                <li key={e.id}>
                                                    + {e.name} (${e.price})
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="ml-4 flex h-full min-h-[80px] flex-col items-end justify-between">
                                <button
                                    onClick={() => handleRemoveItem(item.key)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>

                                {/* Contador */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => decrement(item.key)}
                                        className="flex h-7 w-7 items-center justify-center rounded border bg-red-500 text-white hover:bg-red-700"
                                    >
                                        −
                                    </button>
                                    <span className="w-5 text-center text-sm font-medium">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increment(item.key)}
                                        className="flex h-7 w-7 items-center justify-center rounded border bg-green-600 text-white hover:bg-green-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                {items.length > 0 && (
                    <div className="border-t p-4">
                        <button
                            onClick={() =>
                                router.visit('/shopping-cart/details')
                            }
                            className="w-full rounded-xl bg-green-600 py-3 text-white"
                        >
                            Total: ${totalPrice.toFixed(2)}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
