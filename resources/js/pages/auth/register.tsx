import { Head, Link, usePage } from '@inertiajs/react';

import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';

export default function Register() {
    const { flash } = usePage<SharedData>().props;

    return (
        <AuthLayout title="Crea una cuenta" description="">
            <Head title="Registrarse" />

            {flash?.error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                                {flash?.error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center gap-5">
                <a
                    href="/auth/google/register"
                    className="rounded-md bg-orange-600 px-8 py-1 text-white hover:border-1 hover:border-orange-600 hover:bg-white hover:text-black hover:text-orange-600"
                >
                    Google
                </a>
            </div>

            <div className="flex items-center justify-center gap-5 text-center">
                <Link href="/login" className="hover:underline">
                    Iniciar sesión
                </Link>
            </div>
        </AuthLayout>
    );
}
