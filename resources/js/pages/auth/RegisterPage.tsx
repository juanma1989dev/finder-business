import { GoogleButtonRegister } from '@/components/app/GoogleButtonRegsiter';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Info, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

interface Props {}

export default function RegisterPage({}: Props) {
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
                    window.location.href = '/auth/google/register';
                },
            },
        );
    };

    return (
        <MainLayout>
            <AuthLayoutTemplate title={`Registrarse `} subTitle={'Registrate '}>
                <Head title="Registrarse" />

                {flash?.error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-[12px] font-bold text-red-600 animate-in fade-in slide-in-from-top-2">
                        {flash.error}
                    </div>
                )}

                <div className="flex flex-col space-y-6">
                    <div className="group relative">
                        {acceptPrivacy && (
                            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-orange-400 to-purple-500 opacity-25 blur transition duration-1000 group-hover:opacity-50" />
                        )}
                        <div className="relative">
                            <GoogleButtonRegister
                                label="Crear cuenta con Google"
                                disabled={!acceptPrivacy}
                                onClick={handleGoogleRegister}
                            />
                        </div>
                    </div>

                    {!acceptPrivacy ? (
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="group flex items-center justify-between rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 p-4 transition-all hover:border-orange-200 hover:bg-orange-50/30"
                        >
                            <div className="flex items-center gap-3 text-left">
                                <div className="rounded-xl bg-white p-2 text-orange-500 shadow-sm">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black tracking-tight text-gray-700 uppercase">
                                        Aviso de Privacidad
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                        Toca para leer y aceptar
                                    </p>
                                </div>
                            </div>
                            <ArrowRight
                                size={16}
                                className="text-gray-300 transition-transform group-hover:translate-x-1"
                            />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-2 text-[10px] font-bold tracking-widest text-green-500 uppercase">
                            <ShieldCheck size={14} />
                            <span>Privacidad aceptada</span>
                        </div>
                    )}

                    {/* LOGIN LINK */}
                    <div className="pt-4 text-center">
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            ¿Ya tienes una cuenta activa?
                        </p>
                        <Link
                            href="/login"
                            className="mt-2 inline-block text-[12px] font-black tracking-tighter text-purple-600 uppercase hover:text-purple-700"
                        >
                            Inicia sesión aquí
                        </Link>
                    </div>
                </div>

                {open && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 animate-in fade-in zoom-in">
                            <div className="flex items-center justify-between border-b border-gray-50 px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
                                        <Info size={20} />
                                    </div>
                                    <h2 className="text-sm font-black tracking-tight text-gray-900 uppercase">
                                        Aviso de Privacidad
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="scrollbar-hide max-h-[50vh] overflow-y-auto px-8 py-6 text-[13px] leading-relaxed text-gray-600">
                                <p className="mb-4 font-bold text-gray-800">
                                    Consentimiento Expreso
                                </p>
                                <p className="mb-6">
                                    Al crear una cuenta mediante Google, usted
                                    otorga su consentimiento expreso para el
                                    tratamiento de sus datos personales conforme
                                    a nuestro Aviso de Privacidad Integral.
                                    Utilizamos su información únicamente para
                                    gestionar sus pedidos y mejorar su
                                    experiencia.
                                </p>
                                <Link
                                    href="/aviso-de-privacidad"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-[11px] font-black text-orange-600 uppercase hover:text-orange-700"
                                >
                                    Leer documento completo
                                    <ArrowRight size={12} />
                                </Link>
                            </div>

                            <div className="flex gap-3 border-t border-gray-50 bg-gray-50/30 px-8 py-6">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-xl py-3 text-[11px] font-black tracking-wider text-gray-400 uppercase hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAcceptPrivacy(true);
                                        setOpen(false);
                                    }}
                                    className="flex-[2] rounded-xl bg-gray-900 py-3 text-[11px] font-black tracking-wider text-white uppercase shadow-lg transition-all hover:bg-purple-700 active:scale-95"
                                >
                                    Aceptar y continuar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AuthLayoutTemplate>
        </MainLayout>
    );
}
