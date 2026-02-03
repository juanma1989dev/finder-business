import DashboardLayout from '@/layouts/dashboard-layout';
// import { dashboard } from '@/routes';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard -  Validar código',
        href: '',
    },
];

type Props = {
    success: string;
    code: string;
};

export default function ValidateCode({ success, code }: Props) {
    const [timer, setTimer] = useState<number>(180);
    const [codeSent, setCodeSent] = useState<string | null>(null);
    const [inputCode, setInputCode] = useState<string>('');
    const [loadingValidate, setLoadingValidate] = useState<boolean>(false);

    const { auth } = usePage<SharedData>().props;
    const { user } = auth;

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        email: user?.email || '',
    });

    const handleSubmitCode = async () => {
        setLoadingValidate(true);
        try {
            const email = user?.email;

            if (inputCode === codeSent) {
                await fetch('/dashboard/profile/business/validate-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: codeSent, email }),
                })
                    .then(() => {
                        toast.success('El código se validó correctamente.');
                    })
                    .catch(() => {
                        toast.error('Error al validar el código');
                    });

                setTimeout(() => {
                    window.location.href = `/profile/business/register?validation=${btoa(codeSent!)}`;
                }, 600);
            } else {
                toast.error('Código incorrecto');
            }
        } catch (err) {
            toast.error('Error inesperado al validar el código.');
        } finally {
            setLoadingValidate(false);
        }
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <ToastContainer />
            <Head title="Dashboard - validar código" />

            {/* {!success && <>Adios</>} */}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border"></div>
            </div>
        </DashboardLayout>
    );
}
