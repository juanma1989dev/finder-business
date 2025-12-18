import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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
import { locations } from '@/data/locations';
import { useDialog } from '@/hooks/useDialog';
import { Business as BusinessType, SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Edit,
    ExternalLink,
    Home,
    Loader2,
    MapPin,
    MoreVertical,
    Plus,
    Save,
    Store,
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
            return { ...data, cords, address };
        });

        method(url, {
            onSuccess: (page) => {
                const props = page.props as unknown as SharedData;
                if (props?.flash?.success) {
                    toast.success(props.flash.success);
                    close();
                }
            },
            onError: (errors) => {
                if (errors.general) toast.error(errors.general);
            },
        });
    };

    const handleDelete = () => {
        if (!businessToDelete) return;
        setLoadingBusinessId(businessToDelete);
        formBusiness.delete(`/dashboard/business/${businessToDelete}`, {
            onFinish: () => {
                setLoadingBusinessId(null);
                setConfirmDeleteOpen(false);
                setBusinessToDelete(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* Header Minimalista */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur-xl">
                <div className="container mx-auto flex h-20 items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">
                            <Store size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Mis Negocios
                            </h1>
                            <p className="hidden text-xs font-medium tracking-wider text-slate-400 uppercase sm:block">
                                Gestión de establecimientos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            asChild
                            className="text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Buscador
                                </span>
                            </Link>
                        </Button>
                        {businesses.length < 10 && (
                            <Button
                                onClick={openForCreate}
                                className="rounded-lg bg-orange-600 shadow-md transition-all hover:bg-orange-700 active:scale-95"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo negocio
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10">
                {businesses.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                            <Plus className="h-10 w-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                            No hay negocios aún
                        </h3>
                        <p className="mt-2 text-slate-500">
                            Comienza creando tu primera sucursal para ser
                            visible.
                        </p>
                        <Button
                            onClick={openForCreate}
                            className="mt-8 bg-orange-600 hover:bg-orange-700"
                        >
                            Crear primer negocio
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {businesses.map((business: any) => (
                            <div
                                key={business.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-100/50"
                            >
                                {/* Imagen con Overlay Suave */}
                                <div className="relative aspect-[16/9] overflow-hidden">
                                    <img
                                        src={
                                            business.cover_image
                                                ? `/storage/${business.cover_image}`
                                                : `/images/${business.category.image}`
                                        }
                                        alt={business.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <Badge className="absolute bottom-3 left-3 border-none bg-white/20 text-white backdrop-blur-md">
                                        {business.category.name}
                                    </Badge>

                                    <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-8 w-8 rounded-full shadow-lg"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        openForEdit(
                                                            business.id,
                                                            business,
                                                        )
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4 text-orange-600" />{' '}
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/business/detail/${business.id}`}
                                                        target="_blank"
                                                    >
                                                        <ExternalLink className="mr-2 h-4 w-4" />{' '}
                                                        Público
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setBusinessToDelete(
                                                            business.id,
                                                        );
                                                        setConfirmDeleteOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-orange-600">
                                        {business.name}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                                        {business.description}
                                    </p>

                                    <div className="mt-5 space-y-2 border-t pt-4 text-[13px] text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin
                                                size={14}
                                                className="text-orange-500"
                                            />
                                            <span className="truncate">
                                                {business.address}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botón Mejorado: Naranja pero no negro */}
                                    <Button
                                        asChild
                                        className="mt-6 w-full border border-orange-100 bg-orange-50 font-bold text-orange-700 shadow-none transition-all duration-300 hover:bg-orange-600 hover:text-white"
                                    >
                                        <Link
                                            href={`/dashboard/business/${business.id}/info-general`}
                                        >
                                            Gestionar Panel
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>

                                {loadingBusinessId === business.id && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                                        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Refinado: Blanco y elegante con acento superior */}
            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
                <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-t-4 border-t-orange-500 p-0">
                    <DialogHeader className="px-8 pt-8 text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                                <Edit className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900">
                                    {editingId
                                        ? 'Actualizar Negocio'
                                        : 'Nuevo Registro'}
                                </DialogTitle>
                                <DialogDescription>
                                    Gestione la información de su
                                    establecimiento
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={handleOnSubmit}
                        className="grid grid-cols-1 gap-5 p-8 sm:grid-cols-2"
                    >
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="font-semibold text-slate-600">
                                Nombre comercial
                            </Label>
                            <Input
                                className="h-11 border-none bg-slate-50 focus-visible:ring-orange-500"
                                placeholder="Ej. La Cafetería de Juan"
                                value={formBusiness.data.name}
                                onChange={(e) =>
                                    formBusiness.setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-600">
                                Categoría
                            </Label>
                            <Select
                                value={formBusiness.data.id_category}
                                onValueChange={(v) =>
                                    formBusiness.setData('id_category', v)
                                }
                            >
                                <SelectTrigger className="h-11 border-none bg-slate-50">
                                    <SelectValue placeholder="Categoría..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {catalogs?.categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-600">
                                Ubicación
                            </Label>
                            <Select
                                value={formBusiness.data.location}
                                onValueChange={(v) =>
                                    formBusiness.setData('location', v)
                                }
                            >
                                <SelectTrigger className="h-11 border-none bg-slate-50">
                                    <SelectValue placeholder="Ciudad..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(locations).map(
                                        ([key, loc]) => (
                                            <SelectItem key={key} value={key}>
                                                {loc.name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label className="font-semibold text-slate-600">
                                Descripción corta
                            </Label>
                            <Input
                                className="h-11 border-none bg-slate-50 focus-visible:ring-orange-500"
                                value={formBusiness.data.description}
                                onChange={(e) =>
                                    formBusiness.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Resumen rápido..."
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label className="font-semibold text-slate-600">
                                Teléfono
                            </Label>
                            <Input
                                type="tel"
                                className="h-11 border-none bg-slate-50"
                                value={formBusiness.data.phone}
                                onChange={(e) =>
                                    formBusiness.setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 sm:col-span-2">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">
                                    Canal de WhatsApp
                                </Label>
                                <p className="text-[11px] text-slate-400">
                                    Permitir mensajes directos
                                </p>
                            </div>
                            <Switch
                                checked={formBusiness.data.use_whatsapp}
                                onCheckedChange={(v) =>
                                    formBusiness.setData('use_whatsapp', v)
                                }
                                className="data-[state=checked]:bg-orange-500"
                            />
                        </div>

                        <DialogFooter className="mt-4 gap-3 border-t pt-6 sm:col-span-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={close}
                                className="text-slate-400"
                            >
                                Cerrar
                            </Button>
                            <Button
                                disabled={formBusiness.processing}
                                className="bg-orange-600 px-10 font-bold shadow-lg shadow-orange-200"
                            >
                                {formBusiness.processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Guardar cambios
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de eliminación */}
            <Dialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
            >
                <DialogContent className="max-w-sm rounded-2xl">
                    <div className="py-4 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-8 w-8 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            ¿Eliminar negocio?
                        </DialogTitle>
                        <DialogDescription className="mt-2 px-4">
                            Esta acción es permanente y borrará toda la
                            configuración.
                        </DialogDescription>
                    </div>
                    <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                        <Button
                            variant="destructive"
                            className="h-11 w-full font-bold"
                            onClick={handleDelete}
                        >
                            Sí, eliminar ahora
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-11 w-full text-slate-400"
                            onClick={() => setConfirmDeleteOpen(false)}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="colored"
            />
        </div>
    );
}
