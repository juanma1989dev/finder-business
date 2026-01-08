import { useCartStore } from '@/store/cart.store';
import { usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import BottomMenu from '@/components/app/BottomMenu';
import Header from '@/components/app/Header';
import { CartFloatButton } from '@/pages/public/business/CartFloatButton';
import { CartDrawer } from '@/pages/public/business/drawer-cart';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const items = useCartStore((state) => state.items);
    const totalItems = items.length;

    return (
        <main className="relative z-10 mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <ToastContainer
                position="top-right"
                className="!z-[9999]"
                autoClose={1800}
            />

            <Header />

            <div className="relative z-10 w-full max-w-6xl p-1 md:mx-auto md:max-w-7xl">
                {children}
            </div>

            {user && (
                <>
                    <div className="fixed right-4 bottom-24 z-[40] transition-all duration-300 ease-out md:right-8 md:bottom-8">
                        <CartFloatButton
                            totalItems={totalItems}
                            onClick={() => setIsCartOpen(true)}
                        />
                    </div>

                    <CartDrawer
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                    />
                </>
            )}

            <BottomMenu />
        </main>
    );
}
