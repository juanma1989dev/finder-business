import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { flash } = usePage<SharedData>().props;

    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [open, setOpen] = useState(false);

    const handleGoogleRegister = () => {
        if (!acceptPrivacy) return;
        window.location.href = '/auth/google/register';
    };

    return (
        <AuthLayout
            title="Crea tu cuenta"
            description="El registro se realiza exclusivamente con Google"
        >
            <Head title="Registrarse" />

            {flash?.error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {flash.error}
                </div>
            )}

            <div className="space-y-6">
                {/* Botón Google */}
                <button
                    type="button"
                    onClick={() => {
                        if (!acceptPrivacy) {
                            return alert(
                                'Debes aceptar el Aviso de Privacidad para continuar',
                            );
                        }
                        window.location.href = '/auth/google/register';
                    }}
                    className={`flex w-full items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition ${
                        acceptPrivacy
                            ? 'text-gray-700 hover:bg-gray-50'
                            : 'opacity-50'
                    }`}
                >
                    {/* Google icon */}
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 533.5 544.3"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#4285F4"
                            d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.3h146.9c-6.3 34-25 62.7-53.3 82v67h86.2c50.4-46.4 81.7-114.8 81.7-193.9z"
                        />
                        <path
                            fill="#34A853"
                            d="M272 544.3c72.6 0 133.5-24.1 178-65.5l-86.2-67c-24 16.1-54.6 25.7-91.8 25.7-70.6 0-130.5-47.6-151.8-111.5h-89.5v69.9c44.4 88.1 135.4 148.4 241.3 148.4z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M120.2 325.9c-10.6-31.8-10.6-66.1 0-97.9V158H30.7c-39.6 79.2-39.6 172.1 0 251.3l89.5-69.9z"
                        />
                        <path
                            fill="#EA4335"
                            d="M272 107.7c39.5-.6 77.5 14 106.4 40.8l79.3-79.3C409.5 24.6 345.2-1.2 272 0 166.1 0 75.1 60.3 30.7 148.4l89.5 69.9C141.5 155.3 201.4 107.7 272 107.7z"
                        />
                    </svg>
                    Crear cuenta con Google
                </button>

                {/* Aviso */}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="w-full rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50"
                >
                    Leer Aviso de Privacidad
                </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="hover:underline">
                    Inicia sesión
                </Link>
            </p>

            {/* Modal Aviso */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Aviso de Privacidad Integral
                            </h2>
                        </div>

                        <div className="max-h-[55vh] overflow-y-auto px-6 py-4 text-sm text-gray-600">
                            <p className="mb-4">
                                Al crear una cuenta mediante Google, usted
                                otorga su consentimiento expreso para el
                                tratamiento de sus datos personales conforme a
                                nuestro Aviso de Privacidad Integral.
                            </p>

                            <Link
                                href="/aviso-de-privacidad"
                                target="_blank"
                                className="font-medium text-orange-600 hover:underline"
                            >
                                Ver Aviso de Privacidad Completo
                            </Link>
                        </div>

                        <div className="flex justify-end gap-3 border-t px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md border px-4 py-2 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAcceptPrivacy(true);
                                    setOpen(false);
                                }}
                                className="rounded-md bg-black px-4 py-2 text-sm text-white"
                            >
                                Aceptar Aviso
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
