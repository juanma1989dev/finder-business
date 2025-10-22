import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { locations } from '@/data/locations';
import { useDialog } from '@/hooks/useDialog';
import { Business as BusinessType, SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
    Edit,
    ExternalLink,
    Loader2,
    MoreVertical,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface Props {
    businesses: BusinessType[];
    catalogs: {
        categories: any[];
    };
}

export default function Business({ businesses, catalogs }: Props) {
    const [loadingBusinessId, setLoadingBusinessId] = useState<string | null>(
        null,
    );

    const [editingBusinessId, setEditingBusinessId] = useState<string | null>(
        null,
    );

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [businessToDelete, setBusinessToDelete] = useState<string | null>(
        null,
    );

    const {
        open,
        editingId,
        form: formBusiness,
        openForCreate,
        openForEdit,
        close,
    } = useDialog({
        initialData: {
            name: '',
            id_category: '',
            description: '',
            long_description: '',
            phone: '',
            use_whatsapp: false,
            location: '',
        },
    });

    const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
        evt.preventDefault();

        const url = editingId
            ? `/dashboard/business/${editingId}`
            : '/dashboard/business';
        const method = editingId ? formBusiness.put : formBusiness.post;

        formBusiness.transform((data) => {
            const locKey = data.location as keyof typeof locations;
            const cords = locations[locKey]?.cords ?? { lat: 0, long: 0 };
            const address = locations[locKey]?.name ?? 'S/D';

            const transformData = {
                ...data,
                cords,
                address,
            };

            console.log({ transformData });

            return transformData;
        });

        method(url, {
            onSuccess: (page) => {
                console.log({ page });
                const props = page.props as unknown as SharedData;

                if (props?.flash?.success) {
                    toast.success(props.flash.success);
                    close();

                    // const metadata = props.flash?.meta;
                    // const validated = metadata
                    //     ? getMetaValue<any>(metadata, 'validated')
                    //     : undefined;
                    // console.log(validated);
                }
            },
            onError: (errors) => {
                console.log({ errors });

                if (errors.general) toast.error(errors.general);
            },
        });
    };

    const handleClickRequestDelete = (businessId: string) => {
        setBusinessToDelete(businessId);
        setConfirmDeleteOpen(true); // abre el modal de confirmación
    };

    const handleClickDeleteBusiness = (businessId: string) => {
        setLoadingBusinessId(businessId);

        formBusiness.delete(`/dashboard/business/${businessId}`, {
            onSuccess: () => {
                setLoadingBusinessId(null);
            },
            onError: () => {
                setLoadingBusinessId(null);
            },
        });
    };

    const handleClickEditBusiness = (business: any) => {
        openForEdit(business.id, business);
    };

    // bg-gradient-to-br from-slate-50 to-blue-50

    return (
        <div className="flex h-screen flex-1 flex-col gap-4 overflow-x-auto bg-blue-50/70">
            {/* Header */}

            <Dialog
                open={confirmDeleteOpen}
                onOpenChange={(isOpen) =>
                    !isOpen && setConfirmDeleteOpen(false)
                }
            >
                <DialogContent className="w-full max-w-5xl border-white/10 bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription className="text-sm">
                            ¿Estás seguro que quieres eliminar este negocio?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteOpen(false)}
                            className="cursor-pointer text-black"
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="cursor-pointer bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                if (businessToDelete)
                                    handleClickDeleteBusiness(businessToDelete);
                                setConfirmDeleteOpen(false);
                                setBusinessToDelete(null);
                            }}
                        >
                            Eliminar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="sticky top-0 z-50 m-0 border-b-1 p-0">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">
                                Mis negocios
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manejas todos tus negocios
                            </p>
                        </div>

                        {businesses.length < 10 && (
                            <Button
                                className="cursor-pointer bg-orange-600 text-white hover:bg-orange-700"
                                onClick={openForCreate}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar negocio
                            </Button>
                        )}

                        <Dialog
                            open={open}
                            onOpenChange={(isOpen) => !isOpen && close()}
                        >
                            <DialogContent className="w-full max-w-5xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingBusinessId
                                            ? 'Editar negocio'
                                            : 'Crear nuevo negocio'}
                                    </DialogTitle>

                                    <DialogDescription className="text-sm text-gray-500">
                                        {editingBusinessId
                                            ? 'Modifica los datos de tu negocio aquí.'
                                            : 'Llena los datos para crear un nuevo negocio.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    className="mt-4 space-y-3"
                                    onSubmit={handleOnSubmit}
                                >
                                    <div>
                                        <Label>Nombre</Label>
                                        <Input
                                            placeholder="Nombre"
                                            className="mt-1"
                                            onChange={(e) => {
                                                formBusiness.setData(
                                                    'name',
                                                    e.target.value,
                                                );
                                            }}
                                            value={formBusiness.data.name}
                                        />
                                        <span className="text-sm text-red-600">
                                            {formBusiness.errors.name}
                                        </span>
                                    </div>
                                    <div>
                                        <Label>Categoría</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                formBusiness.setData(
                                                    'id_category',
                                                    value,
                                                )
                                            }
                                            value={
                                                formBusiness.data.id_category
                                            }
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Selecciona la categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {catalogs?.categories.map(
                                                    (cat) => (
                                                        <SelectItem
                                                            key={cat.id}
                                                            value={cat.id.toString()}
                                                        >
                                                            {cat.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-sm text-red-600">
                                            {formBusiness.errors.id_category}
                                        </span>
                                    </div>

                                    <div>
                                        <Label>Descripción</Label>
                                        <Input
                                            onChange={(e) => {
                                                formBusiness.setData(
                                                    'description',
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="Descripción"
                                            className="mt-1"
                                            value={
                                                formBusiness.data.description
                                            }
                                        />
                                        <span className="text-sm text-red-600">
                                            {formBusiness.errors.description}
                                        </span>
                                    </div>
                                    <div>
                                        <Label>Descripción larga</Label>
                                        <Textarea
                                            onChange={(e) => {
                                                formBusiness.setData(
                                                    'long_description',
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="Descripción larga"
                                            className="mt-1"
                                            rows={5}
                                            value={
                                                formBusiness.data
                                                    .long_description
                                            }
                                        />
                                        <span className="text-sm text-red-600">
                                            {
                                                formBusiness.errors
                                                    .long_description
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <Label>Ubicación</Label>
                                        <Select
                                            value={formBusiness.data.location}
                                            onValueChange={(value) => {
                                                formBusiness.setData(
                                                    'location',
                                                    value,
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Selecciona tu ubicación" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {Object.entries(locations).map(
                                                    ([key, location]) => (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {location.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <span className="text-sm text-red-600">
                                            {formBusiness.errors.location}
                                        </span>
                                    </div>

                                    <div>
                                        <Label>Teléfono</Label>
                                        <Input
                                            onChange={(e) => {
                                                formBusiness.setData(
                                                    'phone',
                                                    e.target.value,
                                                );
                                            }}
                                            placeholder="Teléfono"
                                            className="mt-1"
                                            value={formBusiness.data.phone}
                                            maxLength={10}
                                            type="tel"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                onCheckedChange={(checked) => {
                                                    formBusiness.setData(
                                                        'use_whatsapp',
                                                        checked,
                                                    );
                                                }}
                                                id="airplane-mode"
                                                checked={
                                                    formBusiness.data
                                                        .use_whatsapp
                                                }
                                                className="mt-2 data-[state=checked]:bg-green-500"
                                            />
                                            <Label
                                                htmlFor="airplane-mode"
                                                className="items-center"
                                            >
                                                Usar para whatsapp
                                            </Label>
                                        </div>

                                        <span className="text-sm text-red-600">
                                            {formBusiness.errors.phone}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="link"
                                            type="button"
                                            className="flex-1 cursor-pointer bg-red-600 text-white"
                                            onClick={() => close()}
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            className="flex-1 cursor-pointer bg-orange-600 text-white"
                                            variant="link"
                                        >
                                            {formBusiness.processing ? (
                                                <Loader2 className="h-4 w-4" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            {editingBusinessId
                                                ? 'Actualizar'
                                                : 'Guardar'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="relative mx-auto w-10/12 overflow-hidden rounded-xl border border-sidebar-border/70 bg-gray-200/50 p-2">
                {/* Se lista los negocios registrados */}
                <div className="mt-1 grid grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {businesses.map((business: any, index: number) => (
                        <div
                            key={business.id}
                            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                        >
                            {loadingBusinessId === business.id && (
                                <Loader2 className="absolute top-1/2 left-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin text-cyan-500 duration-500" />
                            )}
                            <div className="relative h-48 bg-gradient-to-br from-orange-600/20 to-orange-800/20">
                                <img
                                    src={
                                        business.cover_image
                                            ? `/storage/${business.cover_image}`
                                            : `/images/${business.category.image}`
                                    }
                                    alt={business.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="cursor-pointer border-white/10 bg-black/70 backdrop-blur-sm hover:bg-black/90"
                                            >
                                                <MoreVertical className="h-4 w-4 text-white" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="border-white/10 bg-gray-800 text-white">
                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-white/5"
                                                onClick={() => {
                                                    handleClickEditBusiness(
                                                        business,
                                                    );
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-white/5">
                                                <Link
                                                    className="flex"
                                                    href={`/business/detail/${business.id}`}
                                                    target="_blank"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Perfil publico
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/10" />
                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-500 hover:bg-red-500/10"
                                                onClick={(evt) =>
                                                    handleClickRequestDelete(
                                                        business?.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="absolute top-3 left-3">
                                    <Badge
                                        // className={
                                        //     business.status === 'active'
                                        //         ? 'border-0 bg-green-600/90 text-white'
                                        //         : 'border-0 bg-gray-600/90 text-white'
                                        // }

                                        className="border-0 bg-green-600/90 text-white"
                                    >
                                        {/* {business.status} */}
                                        Activo
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-2 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-1 text-lg font-semibold">
                                            {business.name}
                                        </h3>
                                        <Badge className="border-white/10 bg-orange-600 text-xs">
                                            {business.category.name}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                    {business.description}
                                </p>

                                {/* <div className="mb-4 flex items-center gap-4 text-sm">
                                    <div className="flex items-center text-gray-400">
                                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                        <span className="font-medium text-white">
                                            {business.averageRating}
                                        </span>
                                        <span className="ml-1">
                                            ({business.totalReviews})
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <Eye className="mr-1 h-4 w-4" />
                                        <span>
                                            {business.monthlyViews.toLocaleString()}
                                        </span>
                                    </div>
                                </div> */}

                                <Link
                                    href={`/dashboard/business/${business.id}/info-general`}
                                >
                                    <Button className="w-full cursor-pointer bg-orange-600 text-white hover:bg-orange-700">
                                        Administrar negocio
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer className="m-0 p-0" />
        </div>
    );
}
