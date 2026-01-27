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
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-purple-200 bg-purple-900/10 p-2 pr-5 text-purple-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-purple-900/20 active:scale-95"
        >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-purple-600 shadow-lg shadow-purple-500/20">
                <ShoppingCart className="h-5 w-5 text-white" />

                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-lg border-2 border-white bg-amber-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                    {totalItems}
                </span>
            </div>

            <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-semibold tracking-widest text-purple-900 uppercase">
                    Tu Carrito
                </span>
                <span className="text-[10px] font-normal text-purple-700/70 uppercase">
                    Ver pedido
                </span>
            </div>
        </button>
    );
};
