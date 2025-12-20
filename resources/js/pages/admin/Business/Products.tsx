import { confirmAlert } from '@/components/app/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Edit3, ImageIcon, Package, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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
    const [services, setServices] = useState(productsAndServices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] =
        useState<ServicesAndProducts | null>(null);

    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Catálogo`,
        url: '#',
    });

    useEffect(() => {
        setServices(productsAndServices);
    }, [productsAndServices]);

    const reloadData = () => {
        router.reload({ only: ['productsAndServices'] });
    };

    const openCreate = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const openEdit = (service: ServicesAndProducts) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingService(null);
        setIsModalOpen(false);
    };

    const handleDeleteService = async (
        businessId?: string,
        serviceId?: string,
    ) => {
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
    };

    console.log(productTypes);

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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition"
                            >
                                {/* Imagen */}
                                <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
                                    {service.image_url ? (
                                        <img
                                            src={service.image_url}
                                            alt={service.name}
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
                                            $
                                            {Number(
                                                service.price,
                                            ).toLocaleString()}
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
                                            size="sm"
                                            className="h-9 flex-1 rounded-lg bg-orange-600 text-xs font-semibold text-white hover:bg-orange-700"
                                            onClick={() => openEdit(service)}
                                        >
                                            <Edit3 size={14} className="mr-2" />
                                            Editar
                                        </Button>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                                            onClick={() =>
                                                handleDeleteService(
                                                    service.business_id,
                                                    service.id,
                                                )
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                open={isModalOpen}
                onClose={closeModal}
                businessId={business.id ?? ''} //productsTypes
                service={editingService}
                onSuccess={() => {
                    reloadData();
                    closeModal();
                }}
                productTypes={productTypes}
            />
        </LayoutBusinessModules>
    );
}
