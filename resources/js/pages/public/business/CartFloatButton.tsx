import { ShoppingCart } from 'lucide-react';

interface Props {
    totalItems: number;
    onClick: () => void;
}

export const CartFloatButton = ({ totalItems, onClick }: Props) => {
    if (totalItems === 0) return null;

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 rounded-[1.5rem] bg-gray-900/95 p-2 pr-5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-500/30">
                <ShoppingCart className="h-5 w-5 text-white" />

                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white ring-2 ring-gray-900">
                    {totalItems}
                </span>
            </div>

            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Tu Carrito
                </span>
                <span className="text-xs font-black">Ver pedido</span>
            </div>
        </button>
    );
};
