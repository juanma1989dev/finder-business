import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

import { GoogleButtonRegister } from '@/components/app/GoogleButtonRegsiter';
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
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-[12px] font-bold text-red-600 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <p>{flash.error}</p>
                </div>
            )}

            <div className="flex flex-col space-y-8">
                <div className="group relative">
                    <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-orange-400 to-purple-500 opacity-20 blur transition duration-1000 group-hover:opacity-40" />
                    <div className="relative">
                        <GoogleButtonRegister
                            label="Continuar con Google"
                            onClick={() => {
                                window.location.href = '/auth/google/login';
                            }}
                        />
                    </div>
                </div>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="mx-4 flex-shrink text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">
                        O accede con tu cuenta
                    </span>
                    <div className="flex-grow border-t border-gray-100"></div>
                </div>

                <div className="text-center">
                    <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        ¿Aún no eres parte de la comunidad?
                    </p>
                    <Link
                        href={`/register?type=${loginConfig.type}`}
                        className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-50 px-6 py-3 text-[12px] font-black tracking-tighter text-orange-600 uppercase transition-all hover:bg-orange-100 active:scale-95"
                    >
                        Crear cuenta nueva
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl" />
        </AuthLayoutTemplate>
    );
}
