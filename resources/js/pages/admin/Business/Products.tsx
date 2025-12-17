// Products.tsx
import { confirmAlert } from '@/components/app/ConfirmAlert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { DollarSign, Edit, Package, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { makeBreadCrumb } from '@/helpers';
import { Business, FlashData, ServicesAndProducts } from '@/types';
import ProductServiceModal from './ProductServiceModal';

interface Props {
    business: Business;
    productsAndServices: ServicesAndProducts[];
}

export default function Products({ business, productsAndServices }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Información general`,
        url: '/',
    });

    const [services, setServices] = useState(productsAndServices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] =
        useState<ServicesAndProducts | null>(null);

    useEffect(() => {
        setServices(productsAndServices);
    }, [productsAndServices]);

    const reloadData = () => {
        router.reload({
            only: ['productsAndServices'],
        });
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
            title: '¿Eliminar producto y/o servicio?',
            description:
                'Esta acción eliminará el producto y/o servicio de forma permanente.',
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios y Productos" />

            <Card className="m-2">
                <CardHeader className="relative">
                    <CardTitle>Servicios y Productos</CardTitle>
                    <CardDescription>
                        Administre las ofertas de su negocio
                    </CardDescription>

                    <Button
                        onClick={openCreate}
                        className="absolute top-4 right-4 bg-orange-600 hover:bg-orange-700"
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Agregar
                    </Button>
                </CardHeader>

                <CardContent>
                    {services.length ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex gap-3 rounded-xl border p-3"
                                >
                                    <img
                                        src={service.image_url}
                                        className="h-24 w-24 rounded-lg object-cover"
                                    />

                                    <div className="flex flex-1 flex-col">
                                        <h4 className="font-semibold">
                                            {service.name}
                                        </h4>

                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {service.description}
                                        </p>

                                        <span className="mt-1 flex items-center font-semibold text-orange-600">
                                            <DollarSign className="h-4 w-4" />
                                            {Number(service.price).toFixed(2)}
                                        </span>

                                        <div className="mt-auto flex justify-end gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    openEdit(service)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-destructive"
                                                onClick={() =>
                                                    handleDeleteService(
                                                        service.business_id,
                                                        service.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Package className="mx-auto mb-4 h-16 w-16 opacity-40" />
                            <p>No hay servicios registrados</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ✅ Modal separado */}
            <ProductServiceModal
                open={isModalOpen}
                onClose={closeModal}
                businessId={business.id ?? ''}
                service={editingService}
                onSuccess={reloadData}
            />
        </AppLayout>
    );
}
