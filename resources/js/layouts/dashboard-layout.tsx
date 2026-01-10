import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface DashboardLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: DashboardLayoutProps) => {
    const { flash } = usePage<{ flash: { error?: string; success?: string } }>()
        .props;

    useEffect(() => {
        if (flash.error) {
            toast.error(flash.error, {
                position: 'top-right',
                theme: 'colored',
            });
        }

        // if (flash.success) {
        //     toast.success(flash.success, {
        //         position: "top-right",
        //     });
        // }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <ToastContainer
                autoClose={1800}
                stacked
                closeOnClick
                pauseOnHover
            />
            {children}
        </AppLayoutTemplate>
    );
};
