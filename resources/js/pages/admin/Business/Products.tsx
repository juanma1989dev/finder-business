import { confirmAlert } from '@/components/app/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Edit3, ImageIcon, Package, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { makeBreadCrumb } from '@/helpers';
import { Business, FlashData, ServicesAndProducts } from '@/types';
import { LayoutBusinessModules } from './LayoutBusinessModules';
import ProductServiceModal from './ProductServiceModal';

interface Props {
    business: Business;
    productsAndServices: ServicesAndProducts[];
}

export default function Products({ business, productsAndServices }: Props) {
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
            {/* ESTA ES LA CLAVE: 
                Usamos lg:col-span-12 para que este div ocupe todo el ancho del grid 
                que definió el LayoutBusinessModules.
            */}
            <div className="lg:col-span-12">
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md"
                            >
                                {/* Contenedor de Imagen */}
                                <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
                                    {service.image_url ? (
                                        <img
                                            src={service.image_url}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            alt={service.name}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-200">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[13px] font-bold text-orange-600 shadow-sm backdrop-blur-sm">
                                            $
                                            {Number(
                                                service.price,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido de la Card */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h4 className="line-clamp-1 text-[15px] font-bold text-slate-800">
                                        {service.name}
                                    </h4>
                                    <p className="mt-2 line-clamp-2 min-h-[32px] text-xs leading-relaxed text-slate-500">
                                        {service.description ||
                                            'Sin descripción disponible.'}
                                    </p>

                                    {/* Footer de la Card */}
                                    <div className="mt-5 flex items-center gap-2 border-t border-slate-50 pt-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-9 flex-1 rounded-xl border-slate-200 text-xs font-bold text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                            onClick={() => openEdit(service)}
                                        >
                                            <Edit3 size={14} className="mr-2" />
                                            Editar
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-xl text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
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
                    /* Estado Vacío */
                    <div className="flex w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-100 bg-white py-20 text-center">
                        <Package size={48} className="mb-4 text-slate-100" />
                        <p className="text-sm font-medium text-slate-400">
                            No hay productos aún
                        </p>
                        <Button
                            onClick={openCreate}
                            variant="link"
                            className="mt-2 font-bold text-orange-600"
                        >
                            Crear el primero
                        </Button>
                    </div>
                )}
            </div>

            <ProductServiceModal
                open={isModalOpen}
                onClose={closeModal}
                businessId={business.id ?? ''}
                service={editingService}
                onSuccess={() => {
                    reloadData();
                    closeModal();
                }}
            />
        </LayoutBusinessModules>
    );
}
