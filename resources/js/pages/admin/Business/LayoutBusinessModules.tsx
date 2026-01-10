import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { LoaderCircle, LucideIcon, Save } from 'lucide-react';
import React from 'react';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    titleHead: string;
    icon: LucideIcon;
    headerTitle: string;
    headerDescription: string;
    buttonText: string;
    onSubmit?: () => void;
    processing?: boolean;
    children: React.ReactNode;
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
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={titleHead} />

            <div className="mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
                <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-orange-600 ring-1 ring-slate-200">
                                <Icon size={20} strokeWidth={2.2} />
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                                    {headerTitle}
                                </h1>
                                <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                                    {headerDescription}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={onSubmit}
                            disabled={processing}
                            className="mt-2 w-full rounded-xl bg-orange-600 px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 sm:mt-0 sm:w-auto"
                        >
                            {processing ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {buttonText}
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {children}
                </main>
            </div>
        </DashboardLayout>
    );
};
