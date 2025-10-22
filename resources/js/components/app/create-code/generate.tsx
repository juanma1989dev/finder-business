import { getMetaValue } from '@/helpers';
import { SharedData } from '@/types';
import emailjs from '@emailjs/browser';
import { router, useForm } from '@inertiajs/react';
import { ArrowBigLeft, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

interface Props {
    props: SharedData;
    stausCodeValidation: boolean;
    setStausCodeValidation: (status: boolean) => void;
    generatedCode: string | null;
    setGeneratedCode: (code: string | null) => void;
    urlBusiness: string;
}

export default function GenerateCode({
    props,
    setStausCodeValidation,
    setGeneratedCode,
    urlBusiness,
}: Props) {
    const { auth, flash } = props;

    // Solo loguea el usuario al montar el componente
    const { user } = auth;

    const { data, post, processing } = useForm({
        email: user?.email || '',
    });

    const handleClickCreateCode = () => {
        post('/dashboard/profile/business/code-to-create', {
            preserveScroll: true,
            onSuccess: (page) => {
                const res = (page as unknown as { props: SharedData }).props;
                const metadata = res?.flash?.meta;
                const code = getMetaValue<string>(metadata, 'code');

                if (!code) {
                    toast.error('No se pudo obtener el código.');
                    return;
                }

                const templateParams = {
                    codigo: code,
                    name: user?.name,
                    email: user?.email,
                };

                emailjs
                    .send(
                        import.meta.env.VITE_EMAILJS_SERVICE_ID,
                        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                        templateParams,
                        {
                            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
                        },
                    )
                    .then(
                        () => {
                            setStausCodeValidation(true);
                            setGeneratedCode(code);
                        },
                        () => toast.error('Error al enviar el código.'),
                    );
            },
            onError: () => toast.error('Error al generar el código.'),
        });
    };

    return (
        <div className="mt-4 flex flex-col items-center justify-center gap-6 p-3">
            <h1 className="text-xl font-bold">Generar código</h1>
            <div className="w-full max-w-lg text-center">
                <p>
                    Para registrar su negocio, es necesario validar previamente
                    su identidad.
                </p>
                <p>
                    Enviaremos un código de confirmación a su correo
                    electrónico.
                </p>
            </div>

            {/* Bloque 2: Botones */}
            {/* Colocar los botones en una fila, centrada y con espacio entre ellos */}
            <div className="flex w-full max-w-lg justify-center gap-5">
                <button
                    disabled={processing}
                    className={`flex items-center gap-3 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${
                        processing
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'cursor-pointer bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => router.get(urlBusiness)}
                >
                    <ArrowBigLeft className="h-4 w-4" />
                    Cancelar
                </button>

                <button
                    onClick={handleClickCreateCode}
                    disabled={processing}
                    className={`flex items-center justify-center gap-3 rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 ${
                        processing
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'cursor-pointer'
                    }`}
                >
                    <MessageSquare className="h-4 w-4" />
                    {processing ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                        'Recibir código'
                    )}
                </button>
            </div>
        </div>
    );
}
