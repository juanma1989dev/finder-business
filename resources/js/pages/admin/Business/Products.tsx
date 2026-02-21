import { confirmAlert } from '@/components/app/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Edit, ImageIcon, Package, Trash2 } from 'lucide-react';
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

            const slug = null;

            await confirmAlert({
                title: '¿Eliminar producto?',
                description: 'Esta acción no se puede deshacer.',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    router.delete(
                        `/dashboard/business/${businessId}-${slug}/services/${serviceId}`,
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
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
                                    className="group flex flex-col overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="relative aspect-square h-55 w-full overflow-hidden bg-purple-50">
                                        {hasImage ? (
                                            <img
                                                src={service.image_url}
                                                alt={service.name || 'Producto'}
                                                className="h-20 w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                <ImageIcon size={36} />
                                            </div>
                                        )}

                                        <div className="absolute top-3 right-3">
                                            <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-purple-700 shadow-sm backdrop-blur-sm">
                                                ${formattedPrice}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-3">
                                        <h4 className="line-clamp-1 text-sm font-semibold text-purple-800">
                                            {service.name}
                                        </h4>

                                        <p className="mt-1 line-clamp-2 min-h-[32px] text-xs font-normal text-gray-500">
                                            {service.description ||
                                                'Sin descripción disponible.'}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 border-t border-purple-100 pt-3">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                aria-label="Eliminar producto"
                                                className="h-8 w-8 cursor-pointer rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
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
                                                className="h-8 flex-1 cursor-pointer rounded-lg bg-purple-600 text-xs font-semibold text-white transition-all hover:bg-purple-700 active:scale-95"
                                                onClick={() =>
                                                    openEdit(service)
                                                }
                                            >
                                                <Edit
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
                    /* ESTADO VACÍO: Paleta Gris */
                    <div className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
                        <Package size={40} className="mb-3 text-gray-300" />
                        <p className="text-base font-semibold text-gray-700">
                            No hay productos aún
                        </p>
                        <p className="mb-4 text-sm text-gray-500">
                            Comienza agregando artículos a tu catálogo.
                        </p>
                        <Button
                            onClick={openCreate}
                            variant="link"
                            className="text-sm font-semibold text-purple-600 active:scale-95"
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
