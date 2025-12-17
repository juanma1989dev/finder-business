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
            className="fixed right-4 bottom-24 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition-all duration-200 hover:bg-green-700 sm:bottom-6 sm:h-16 sm:w-16"
        >
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-6 sm:w-6 sm:text-sm">
                    {totalItems}
                </span>
            )}
        </button>
    );
};
