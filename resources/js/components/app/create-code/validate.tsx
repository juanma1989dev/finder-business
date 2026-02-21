import { getMetaValue } from '@/helpers';
import { SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    props: SharedData;
    code: string | null;
}

export default function CodeValidation({ props, code }: Props) {
    const [timer, setTimer] = useState<number>(180);
    const [inputCode, setInputCode] = useState<string>('');

    const { auth } = usePage<SharedData>().props;
    const { user } = auth;
    const email = user?.email;

    const { processing, post } = useForm({
        code,
        email,
    });

    useEffect(() => {
        if (code) {
            toast.success('El código se envió correctamente.');
        }
    }, []);

    const handleSubmitCode = async () => {
        if (inputCode === code) {
            post('/dashboard/profile/business/validate-code', {
                preserveScroll: true,
                onSuccess: (page) => {
                    const res = (page as unknown as { props: SharedData })
                        .props;
                    const metadata = res?.flash?.meta;
                    const validated = getMetaValue<any>(metadata, 'validated');

                    if (validated > 0) {
                        return router.get('/dashboard/business/create', {
                            validate: btoa(code),
                        });
                    }

                    toast.error('Error al validar el código');
                },
                onError: () => {
                    toast.error('Error al validar el código');
                },
            });
        } else {
            toast.error('Código incorrecto');
        }
    };
    return (
        <div className="mt-4 grid grid-cols-1 gap-6 p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="mt-4 flex flex-col gap-2">
                <span>
                    El código es válido por: {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, '0')}
                    {' minutos.'}
                </span>

                <input
                    type="text"
                    placeholder="Ingresa el código"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full rounded-md border p-2"
                />

                <button
                    onClick={handleSubmitCode}
                    disabled={processing}
                    className={`flex items-center justify-center rounded-md px-4 py-2 text-white ${
                        processing
                            ? 'cursor-not-allowed bg-green-300'
                            : 'cursor-pointer bg-green-500 hover:opacity-90'
                    }`}
                >
                    {processing ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                        'Validar código'
                    )}
                </button>
            </div>
        </div>
    );
}
