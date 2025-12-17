import { GoogleButtonRegister } from '@/components/app/GoogleButtonRegsiter';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { flash } = usePage<SharedData>().props;

    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [open, setOpen] = useState(false);

    const handleGoogleRegister = async () => {
        if (!acceptPrivacy) return;

        router.post(
            '/session/privacy-accept',
            {},
            {
                onSuccess: () => {
                    console.log('register ... ');
                    window.location.href = '/auth/google/register';
                },
            },
        );
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
                <GoogleButtonRegister
                    label="Crear cuenta con Google"
                    disabled={!acceptPrivacy}
                    onClick={handleGoogleRegister}
                />

                {/* Aviso */}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="w-full rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50"
                >
                    Leer Aviso de Privacidad
                </button>
            </div>

            <p className="mt-6 mt-15 text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link
                    href="/login"
                    className="font-medium text-orange-600 hover:underline"
                >
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
