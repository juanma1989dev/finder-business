import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import ProviderLayout from './ProviderLayout';

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
    }, [flash]);

    return (
        <ProviderLayout>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                <ToastContainer
                    autoClose={1800}
                    stacked
                    closeOnClick
                    pauseOnHover
                />
                {children}
            </AppLayoutTemplate>
        </ProviderLayout>
    );
};
