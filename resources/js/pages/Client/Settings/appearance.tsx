import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import DashboardLayout from '@/layouts/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { edit as editAppearance } from '@/routes/appearance';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de apariencia',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de apariencia" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Configuración de apariencia"
                        description="Actualiza la configuración de apariencia de tu cuenta"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
