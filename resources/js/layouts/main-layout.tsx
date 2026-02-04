import { usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Header from '@/components/app/Header';
import MobileSidebar from '@/components/app/MobileSidebar';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { PwaUpdateBanner } from '@/components/PwaUpdateBanner';
import { usePwaUpdate } from '@/hooks/usePwaUpdate';
import { CartFloatButton } from '@/pages/public/business/CartFloatButton';
import { CartDrawer } from '@/pages/public/business/drawer-cart';
import { SharedData } from '@/types';

interface MainLayoutProps {
    children: ReactNode;
    showFloatShoppingCart?: boolean;
}

export default function MainLayout({
    children,
    showFloatShoppingCart = true,
}: MainLayoutProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { cart, auth } = usePage<SharedData>().props;
    const items = Object.values(cart);
    const user = auth?.user;
    const totalItems = items.length;
    const { updateAvailable, refreshApp } = usePwaUpdate();

    return (
        <main className="relative z-10 mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-0 md:px-4 md:pt-4">
            <ToastContainer
                position="top-right"
                className="!z-[9999]"
                autoClose={1800}
            />

            <Header />

            <div className="relative z-10 w-full max-w-6xl p-1 md:mx-auto md:max-w-7xl">
                {children}
                {updateAvailable && <PwaUpdateBanner onRefresh={refreshApp} />}
                <PWAInstallBanner />
            </div>

            {user && (
                <>
                    {showFloatShoppingCart && (
                        <div className="fixed right-4 bottom-24 z-[40] md:right-8 md:bottom-8">
                            <CartFloatButton
                                totalItems={totalItems}
                                onClick={() => setIsCartOpen(true)}
                            />
                        </div>
                    )}

                    <CartDrawer
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                    />
                </>
            )}

            <MobileSidebar />
        </main>
    );
}
