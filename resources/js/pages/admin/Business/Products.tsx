import { confirmAlert } from '@/components/app/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Edit3, ImageIcon, Package, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { makeBreadCrumb } from '@/helpers';
import {
    Business,
    FlashData,
    ProductsTypes,
    ServicesAndProducts,
} from '@/types';
import { LayoutBusinessModules } from './LayoutBusinessModules';
import ProductServiceModal from './ProductServiceModal';

interface Props {
    business: Business;
    productTypes: ProductsTypes[];
    productsAndServices: ServicesAndProducts[];
}

export default function Products({
    business,
    productsAndServices,
    productTypes,
}: Props) {
    const services = productsAndServices;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] =
        useState<ServicesAndProducts | null>(null);

    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Catálogo`,
        url: '#',
    });

    const reloadData = useCallback(() => {
        router.reload({ only: ['productsAndServices'] });
    }, []);

    const openCreate = useCallback(() => {
        setEditingService(null);
        setIsModalOpen(true);
    }, []);

    const openEdit = useCallback((service: ServicesAndProducts) => {
        setEditingService(service);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setEditingService(null);
        setIsModalOpen(false);
    }, []);

    const handleDeleteService = useCallback(
        async (businessId?: string, serviceId?: string) => {
            if (!businessId || !serviceId) return;

            await confirmAlert({
                title: '¿Eliminar producto?',
                description: 'Esta acción no se puede deshacer.',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    router.delete(
                        `/dashboard/business/${businessId}/services/${serviceId}`,
                        {
                            onSuccess: (page) => {
                                const flash = (page.props as any)
                                    .flash as FlashData;

                                if (flash?.success) {
                                    toast.success(flash.success);
                                    reloadData();
                                }
                            },
                        },
                    );
                },
            });
        },
        [reloadData],
    );

    return (
        <LayoutBusinessModules
            titleHead="Catálogo"
            headerTitle="Productos y Servicios"
            headerDescription={`${services.length} artículos registrados`}
            buttonText="Nuevo Producto"
            icon={Package}
            processing={false}
            breadcrumbs={breadcrumbs}
            onSubmit={openCreate}
        >
            <div className="lg:col-span-12">
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                        {services.map((service) => {
                            const hasImage =
                                typeof service.image_url === 'string' &&
                                service.image_url.trim() !== '';

                            const formattedPrice = Number.isFinite(
                                Number(service.price),
                            )
                                ? Number(service.price).toLocaleString()
                                : '0';

                            return (
                                <div
                                    key={service.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition"
                                >
                                    {/* Imagen */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
                                        {hasImage ? (
                                            <img
                                                src={service.image_url}
                                                alt={service.name || 'Producto'}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-200">
                                                <ImageIcon size={36} />
                                            </div>
                                        )}

                                        {/* Precio */}
                                        <div className="absolute top-3 right-3">
                                            <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-orange-600 shadow-sm backdrop-blur">
                                                ${formattedPrice}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex flex-1 flex-col p-4">
                                        <h4 className="line-clamp-1 text-sm font-semibold text-slate-800">
                                            {service.name}
                                        </h4>

                                        <p className="mt-1 line-clamp-2 min-h-[32px] text-xs text-slate-500">
                                            {service.description ||
                                                'Sin descripción disponible.'}
                                        </p>

                                        {/* Acciones */}
                                        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                aria-label="Eliminar producto"
                                                className="cursor-pointer rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                                                onClick={() =>
                                                    handleDeleteService(
                                                        service.business_id,
                                                        service.id,
                                                    )
                                                }
                                            >
                                                <Trash2 size={14} />
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="flex-1 cursor-pointer rounded-lg bg-orange-600 text-xs font-semibold text-white hover:bg-orange-700"
                                                onClick={() =>
                                                    openEdit(service)
                                                }
                                            >
                                                <Edit3
                                                    size={14}
                                                    className="mr-2"
                                                />
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Estado vacío */
                    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                        <Package size={40} className="mb-3 text-slate-200" />
                        <p className="text-sm font-medium text-slate-400">
                            No hay productos aún
                        </p>
                        <Button
                            onClick={openCreate}
                            variant="link"
                            className="mt-1 text-sm font-semibold text-orange-600"
                        >
                            Crear el primero
                        </Button>
                    </div>
                )}
            </div>

            <ProductServiceModal
                key={editingService?.id ?? 'create'}
                open={isModalOpen}
                onClose={closeModal}
                businessId={business.id ?? ''}
                product={editingService}
                onSuccess={() => {
                    reloadData();
                    closeModal();
                }}
                productTypes={productTypes}
            />
        </LayoutBusinessModules>
    );
}
