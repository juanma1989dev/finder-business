import BottomMenu from '@/components/app/BottomMenu';
import Header from '@/components/app/Header';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

interface MainLayout {
    children: ReactNode;
}

export default ({ children, ...props }: MainLayout) => {
    return (
        <main className="relative z-10 mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <ToastContainer
                position="top-right"
                className="!z-[9999]"
                autoClose={1800}
            />
            <Header />
            {/* <div className="relative z-10 mx-auto max-w-7xl p-0 md:p-6"> */}
            <div className="relative z-10 w-full max-w-6xl p-1 md:mx-auto md:max-w-7xl md:p-6">
                {children}
            </div>
            <BottomMenu />
        </main>
    );
};
