import { GoogleButtonRegister } from '@/components/app/GoogleButtonRegsiter';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Login() {
    const { flash } = usePage<SharedData>().props;

    return (
        <AuthLayout
            title="Iniciar sesión"
            description="Inicia sesión para continuar"
        >
            <Head title="Iniciar sesión" />

            {flash?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {flash.error}
                </div>
            )}

            <div className="space-y-6">
                <GoogleButtonRegister
                    label="Continuar con Google"
                    onClick={() => {
                        window.location.href = '/auth/google/login';
                    }}
                />

                <div className="mt-15 text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-orange-600 hover:underline"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
