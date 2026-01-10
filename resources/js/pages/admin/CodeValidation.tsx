import GenerateCode from '@/components/app/create-code/generate';
import CodeValidation from '@/components/app/create-code/validate';
import DashboardLayout from '@/layouts/dashboard-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard - Nuevo negocio',
        href: dashboard().url,
    },
];

interface Props {
    numBusiness: number;
}

const URL_BUSINESS = '/dashboard/profile/business/';

export default function ConfirmCode({ numBusiness }: Props) {
    const [stausCodeValidation, setStausCodeValidation] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const props = usePage<SharedData>().props;

    // Si el usuario ya tiene 5 negocios, redirige a la lista de negocios  - Posteriormente cambiar a configuración de negocio segun el perfil del usuario
    if (numBusiness >= 5) {
        return router.visit(URL_BUSINESS);
    }

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <ToastContainer />
            <Head title="Dashboard - Nuevo negocio - " />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {!stausCodeValidation && !generatedCode ? (
                        <GenerateCode
                            props={props}
                            stausCodeValidation={stausCodeValidation}
                            setStausCodeValidation={setStausCodeValidation}
                            generatedCode={generatedCode}
                            setGeneratedCode={setGeneratedCode}
                            urlBusiness={URL_BUSINESS}
                        />
                    ) : (
                        <CodeValidation props={props} code={generatedCode} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
