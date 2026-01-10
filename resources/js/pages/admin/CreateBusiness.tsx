import DashboardLayout from '@/layouts/dashboard-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import BusinessForm from './BusinessForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard - Nuevo negocio',
        href: dashboard().url,
    },
];

interface Props {
    categories: Array<{
        id: number;
        name: string;
        image: string;
    }>;
    flash?: {
        success?: string;
        error?: string;
    };
    errorMessage?: string;
}

export default function CreateBusiness({
    categories,
    errorMessage,
    flash,
}: Props) {
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);

            const timer = setTimeout(() => {
                router.visit('/dashboard/profile/business');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Nuevo negocio" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}

                    <BusinessForm
                        categories={categories}
                        submitUrl="/dashboard/business/create"
                        onSuccess={() =>
                            router.visit('/dashboard/profile/business')
                        }
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
