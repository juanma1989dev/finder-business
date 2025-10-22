import { confirmAlert } from '@/components/app/ConfirmAlert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    Business,
    FlashData,
    ServicesAndProducts,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    DollarSign,
    Edit,
    LoaderCircle,
    Package,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard - Nuevo negocio',
        // href: dashboard().url,
        href: '',
    },
];

interface Props {
    business: Business;
    productsAndServices: any;
}

const SERVICE_CATEGORIES = [
    'Product',
    'Service',
    'Package',
    'Consultation',
    'Other',
];

const initialData = {
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: '1',
    isActive: true,
    image: undefined as File | undefined,
    image_url: '',
};

export default function Products({ business, productsAndServices }: Props) {
    const [services, setServices] =
        useState<ServicesAndProducts[]>(productsAndServices);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] =
        useState<ServicesAndProducts | null>(null);

    const formProduct = useForm(initialData);

    const handleOpenDialog = (service?: ServicesAndProducts) => {
        if (service) {
            setEditingService(service);
            formProduct.setData({
                name: service.name,
                description: service.description,
                price: service.price,
                duration: service.duration || '',
                category: service.category,
                isActive: service.isActive,
                image_url: service.image_url || '',
            });
        } else {
            formProduct.setData(initialData);
        }

        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingService(null);
        formProduct.setData(initialData);
        formProduct.resetAndClearErrors();
    };

    const handleSaveService = () => {
        const urlAction = editingService
            ? `/dashboard/business/${business.id}/services/${editingService.id}`
            : `/dashboard/business/${business.id}/services`;

        if (editingService) {
            formProduct.transform((data) => ({
                ...data,
                _method: 'PUT',
            }));
        } else {
            formProduct.transform((data) => {
                const cleanData = { ...data };
                return cleanData;
            });
        }

        formProduct.post(urlAction, {
            forceFormData: true,
            onSuccess: (page) => {
                const flash = (page.props as any).flash as
                    | FlashData
                    | undefined;

                if (flash?.success) {
                    toast.success(flash?.success);
                    handleCloseDialog();
                    reloadData();
                } else if (flash?.error) {
                    toast.error(flash?.error);
                }
            },
            onError: (errors) => {
                if (errors.general) {
                    toast.error(errors.general);
                }
            },
        });
    };

    const handleDeleteService = async (
        idBusiness: string | undefined,
        idService: string | undefined,
    ) => {
        const confirmed = await confirmAlert({
            title: '¿Eliminar producto y/o servicio?',
            description:
                'Esta acción eliminará el producto y/o servicio de forma permanente.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                formProduct.delete(
                    `/dashboard/business/${idBusiness}/services/${idService}`,
                    {
                        onSuccess: (page) => {
                            const flash = (page.props as any).flash as
                                | FlashData
                                | undefined;

                            if (flash?.success) {
                                toast.success(flash.success);
                                reloadData();
                            } else if (flash?.error) {
                                toast.error(flash.error);
                            }
                        },
                        onError: (errors) => {
                            if (errors?.general) {
                                toast.error(errors?.general);
                            }
                        },
                    },
                );
            },
        });
    };

    const [loading, setLoading] = useState(!productsAndServices?.length);

    useEffect(() => {
        setServices(productsAndServices);
        setLoading(false);
    }, [productsAndServices]);

    const reloadData = function () {
        setLoading(true);
        router.reload({
            only: ['productsAndServices'],
            onFinish: () => setLoading(false),
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Nuevo negocio" />
            <Card className="relative m-2 p-2">
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Servicios y Productos</CardTitle>
                            <CardDescription>
                                Administre las ofertas, precios y disponibilidad
                                de su negocio
                            </CardDescription>
                        </div>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => handleOpenDialog()}
                                    className="absolute top-2 right-2 cursor-pointer bg-orange-600 hover:bg-orange-700"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Agregar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingService
                                            ? 'Editar servicio y/o producto'
                                            : 'Añadir servicio y/o producto'}
                                    </DialogTitle>
                                    {/* <DialogDescription>
                                    {editingService ? 'Actualizar' : 'Agregar'}
                                </DialogDescription> */}
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="service-name">
                                            Nombre
                                        </Label>
                                        <Input
                                            id="service-name"
                                            value={formProduct.data.name}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                formProduct.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Pizza, Tlayuda ..."
                                        />
                                        {formProduct.errors.name && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {formProduct.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service-description">
                                            Descripción
                                        </Label>
                                        <Textarea
                                            id="service-description"
                                            value={formProduct.data.description}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                formProduct.setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Describe que incluye tu servicio o producto"
                                            rows={3}
                                        />
                                        {formProduct.errors.description && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {formProduct.errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="service-price">
                                                Precio ($)
                                            </Label>
                                            <Input
                                                id="service-price"
                                                type="number"
                                                min="0"
                                                step="1"
                                                autoComplete="off"
                                                value={formProduct.data.price}
                                                onChange={(e) =>
                                                    formProduct.setData(
                                                        'price',
                                                        Number(e.target.value),
                                                    )
                                                }
                                                placeholder="0.00"
                                            />
                                            {formProduct.errors.price && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {formProduct.errors.price}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="service-duration">
                                                Duración (opcional)
                                            </Label>
                                            <Input
                                                id="service-duration"
                                                value={
                                                    formProduct.data.duration
                                                }
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    formProduct.setData(
                                                        'duration',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="30 min, 1 hora"
                                            />
                                            {formProduct.errors.duration && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {
                                                        formProduct.errors
                                                            .duration
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service-category">
                                            Categoria
                                        </Label>
                                        <select
                                            id="service-category"
                                            value={formProduct.data.category}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                formProduct.setData(
                                                    'category',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        >
                                            {SERVICE_CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        {formProduct.errors.category && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {formProduct.errors.category}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="service-active"
                                            checked={formProduct.data.isActive}
                                            onChange={(e) =>
                                                formProduct.setData(
                                                    'isActive',
                                                    Boolean(e.target.checked),
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label
                                            htmlFor="service-active"
                                            className="cursor-pointer font-normal"
                                        >
                                            Activo (visible a los clientes)
                                        </Label>
                                        {formProduct.errors.isActive && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {formProduct.errors.isActive}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-2 transition-colors hover:border-muted-foreground/50">
                                        <input
                                            type="file"
                                            id="gallery-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file)
                                                    formProduct.setData(
                                                        'image',
                                                        file,
                                                    );
                                            }}
                                        />
                                        <label
                                            htmlFor="gallery-upload"
                                            className="cursor-pointer text-center"
                                        >
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-orange-600">
                                                    Subir imagen
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG o GIF hasta 10MB
                                                </p>
                                            </div>
                                        </label>

                                        {(formProduct.data.image ||
                                            formProduct.data.image_url) && (
                                            <img
                                                src={
                                                    formProduct.data.image
                                                        ? URL.createObjectURL(
                                                              formProduct.data
                                                                  .image,
                                                          )
                                                        : formProduct.data
                                                              .image_url
                                                }
                                                alt="Vista previa"
                                                className="mt-4 h-24 w-24 rounded-lg border object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleCloseDialog}
                                        disabled={formProduct.processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveService}
                                        className="cursor-pointer bg-orange-600 hover:bg-orange-700"
                                        disabled={formProduct.processing}
                                    >
                                        {formProduct.processing ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin duration-500" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        {editingService
                                            ? 'Actualizar '
                                            : 'Agregar '}
                                        servicio
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {services.length > 0 ? (
                        // <div className="space-y-2 bg-red-900">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex flex-col items-start rounded-xl border p-3 shadow-sm transition-colors hover:bg-muted/50 lg:flex-row"
                                >
                                    {/* Imagen */}
                                    <div className="mb-3 flex-shrink-0 self-center lg:mr-4 lg:mb-0">
                                        <img
                                            src={service?.image_url}
                                            alt={service.name}
                                            className="h-24 w-24 rounded-lg border-2 object-cover"
                                        />
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex w-full flex-1 flex-col justify-between">
                                        {/* <div className="bg-green-800"> */}
                                        <div className="flex flex-wrap items-center gap-1">
                                            <h4 className="text-base font-semibold">
                                                {service.name}
                                            </h4>

                                            {/* <Badge
                                            variant={
                                                service.isActive
                                                    ? 'default'
                                                    : 'secondary'
                                            }

                                            className="text-xs "
                                        >
                                            {service.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge> */}

                                            {/* <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {service.category}
                                                    </Badge> */}
                                        </div>

                                        <p className="mt-1 line-clamp-2 text-sm wrap-break-word text-muted-foreground">
                                            {service.description}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm wrap-anywhere">
                                            <span className="flex items-center font-semibold text-orange-600">
                                                <DollarSign className="mr-1 h-4 w-4" />
                                                {Number(
                                                    service.price ?? 0,
                                                ).toFixed(2)}
                                            </span>

                                            {service.duration && (
                                                <span className="text-muted-foreground">
                                                    Duration: {service.duration}
                                                </span>
                                            )}
                                        </div>

                                        {/* Botones */}
                                        <div className="mt-4 flex justify-end gap-1">
                                            <Button
                                                className="m-0 cursor-pointer border-1 p-0 text-orange-600 hover:text-orange-600"
                                                size="sm"
                                                variant="ghost"
                                                title="Editar"
                                                onClick={() =>
                                                    handleOpenDialog(service)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleDeleteService(
                                                        service.business_id,
                                                        service.id,
                                                    )
                                                }
                                                title="Eliminar"
                                                className="m-0 cursor-pointer border-1 p-0 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Aún no hay productos o servicios disponibles
                            </p>
                            {/* <p className="text-xs text-muted-foreground">
                            Add your first offering to get started
                        </p> */}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
