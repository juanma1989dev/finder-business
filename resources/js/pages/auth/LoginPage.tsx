import { GoogleButtonRegister } from '@/components/app/GoogleButtonRegsiter';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
    loginConfig: any;
}

export default function LoginPage({ loginConfig }: Props) {
    const { flash } = usePage<SharedData>().props;

    return (
        <AuthLayoutTemplate
            title={`Inicio de sesión - ${loginConfig.label}`}
            subTitle={loginConfig.subTitle}
            bannerImage={loginConfig.banner}
        >
            <Head title="Iniciar sesión" />

            {flash?.error && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-normal text-amber-700 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} className="text-amber-600" />
                    <p>{flash.error}</p>
                </div>
            )}

            <div className="flex flex-col space-y-2">
                <div className="group relative mb-4">
                    <div className="absolute -inset-0.5 rounded-lg bg-purple-600 opacity-10 blur transition duration-1000 group-hover:opacity-20" />
                    <div className="relative">
                        <GoogleButtonRegister
                            label="Continuar con Google"
                            onClick={() => {
                                window.location.href = '/auth/google/login';
                            }}
                        />
                    </div>
                </div>

                <div className="relative mb-4 flex items-center py-2">
                    <div className="flex-grow border-t border-purple-200"></div>
                    <span className="mx-4 flex-shrink text-[10px] leading-tight font-normal text-gray-500 uppercase">
                        O accede con tu cuenta
                    </span>
                    <div className="flex-grow border-t border-purple-200"></div>
                </div>

                <div className="p-3 text-center">
                    <p className="text-[10px] leading-tight font-normal text-gray-500 uppercase">
                        ¿Aún no eres parte de la comunidad?
                    </p>
                    <Link
                        href={`/register?type=${loginConfig.type}`}
                        className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
                    >
                        Crear cuenta nueva
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-50 opacity-50 blur-3xl" />
        </AuthLayoutTemplate>
    );
}
