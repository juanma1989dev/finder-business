import { usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import Header from '@/components/app/Header';
import MobileSidebar from '@/components/app/MobileSidebar';
import { messaging, onMessage } from '@/firebase';
import { usePwaUpdate } from '@/hooks/usePwaUpdate';
import { CartFloatButton } from '@/pages/Public/Business/CartFloatButton';
import { CartDrawer } from '@/pages/Public/Business/drawer-cart';
import { SharedData } from '@/types';
import ProviderLayout from './ProviderLayout';

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

    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            window.dispatchEvent(
                new CustomEvent('firebase-message', { detail: payload }),
            );

            const title =
                payload.notification?.title ||
                payload.data?.title ||
                'Nuevo pedido';

            const body = payload.notification?.body || payload.data?.body || '';

            toast.success(
                <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-[10px]">{body}</p>
                </div>,
            );
        });

        return () => unsubscribe();
    }, []);

    return (
        <ProviderLayout>
            <main className="relative z-10 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <ToastContainer
                    position="top-right"
                    className="!z-[9999]"
                    autoClose={1800}
                />

                <Header />

                <div className="relative z-10 w-full max-w-6xl p-1 md:mx-auto md:max-w-7xl">
                    {children}
                    {/* {updateAvailable && <PwaUpdateBanner onRefresh={refreshApp} />} */}
                    {/* <PWAInstallBanner /> */}
                </div>

                {user && (
                    <>
                        {showFloatShoppingCart && (
                            <CartFloatButton
                                totalItems={totalItems}
                                onClick={() => setIsCartOpen(true)}
                            />
                        )}

                        <CartDrawer
                            isOpen={isCartOpen}
                            onClose={() => setIsCartOpen(false)}
                        />
                    </>
                )}

                <MobileSidebar />
            </main>
        </ProviderLayout>
    );
}
