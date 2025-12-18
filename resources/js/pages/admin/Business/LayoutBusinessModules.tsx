import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';

import { LucideIcon } from 'lucide-react';
import React from 'react';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    titleHead: string; // Para el <Head />
    icon: LucideIcon; // Icono dinámico de Lucide
    headerTitle: string; // Título dentro del cuadro blanco
    headerDescription: string; // Subtítulo
    buttonText: string; // Texto del botón
    onSubmit?: () => void; // Función a ejecutar
    processing?: boolean; // Estado de carga
    children: React.ReactNode; // Contenido del módulo
}

export const LayoutBusinessModules = ({
    breadcrumbs,
    titleHead,
    icon: Icon,
    headerTitle,
    headerDescription,
    buttonText,
    onSubmit,
    processing = false,
    children,
}: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titleHead} />

            <div className="mx-auto w-full space-y-4 px-3 py-3">
                {/* Header Card Reutilizable */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors">
                            <Icon size={24} />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-900">
                                {headerTitle}
                            </h1>
                            <p className="text-xs text-slate-500">
                                {headerDescription}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={onSubmit}
                        disabled={processing}
                        size="sm"
                        className="h-10 w-full rounded-xl border border-orange-100 bg-orange-50 px-6 text-xs font-bold text-orange-700 shadow-none transition-all hover:bg-orange-600 hover:text-white sm:w-auto"
                    >
                        {processing ? (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {buttonText}
                    </Button>
                </div>

                {/* Contenedor del contenido (Formularios, Tablas, etc) */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
};
