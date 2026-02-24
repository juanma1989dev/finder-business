import { ShoppingCart } from 'lucide-react';

interface Props {
    totalItems: number;
    onClick: () => void;
}

export const CartFloatButton = ({ totalItems, onClick }: Props) => {
    if (totalItems === 0) return null;

    return (
        <div className="0 fixed right-4 bottom-4 z-[40] md:right-8 md:bottom-8">
            <button
                onClick={onClick}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-purple-200 bg-purple-600/80 p-2 pr-5 text-white shadow-sm backdrop-blur-sm"
            >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 shadow-lg shadow-purple-500/20">
                    <ShoppingCart className="h-4 w-4" />

                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-lg border-2 border-white bg-amber-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                        {totalItems}
                    </span>
                </div>

                <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] font-semibold tracking-widest text-white uppercase">
                        Tu Carrito
                    </span>
                    <span className="text-[10px] font-normal text-white uppercase">
                        Ver pedido
                    </span>
                </div>
            </button>
        </div>
    );
};
