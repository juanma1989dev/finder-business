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
            className="fixed right-4 bottom-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition-all duration-200 hover:bg-green-700 sm:right-20 sm:bottom-15 sm:h-10 sm:w-10 md:right-10"
        >
            <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-6 sm:w-6 sm:text-sm">
                    {totalItems}
                </span>
            )}
        </button>
    );
};
