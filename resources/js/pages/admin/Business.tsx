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
    Loader2,
    MapPin,
    MoreVertical,
    Plus,
    Save,
    Search,
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
            category_id: '',
            slogan: '',
            description: '',
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
        <div className="min-h-screen bg-[#FDFDFF]">
            {/* Header: Elegancia en Purple con sutil acento naranja */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-md">
                <div className="container mx-auto flex h-20 items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                            <Store size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                                Mis Negocios
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                                <p className="text-[10px] font-bold tracking-widest text-violet-500 uppercase">
                                    Panel de Gestión
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            asChild
                            className="rounded-xl text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-600"
                        >
                            <Link href="/">
                                <Search className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Buscador
                                </span>
                            </Link>
                        </Button>

                        {/*  */}
                        {businesses.length < 10 && (
                            <Button
                                onClick={openForCreate}
                                className="rounded-xl bg-violet-600 px-4 font-bold text-white shadow-lg shadow-violet-100 transition-all hover:bg-violet-700 active:scale-95"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo negocio
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {businesses.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-violet-100 bg-white p-12 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50">
                            <Plus className="h-10 w-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                            Empieza tu aventura
                        </h3>
                        <p className="mt-2 text-slate-500">
                            Crea tu primera sucursal para que todos te vean.
                        </p>
                        <Button
                            onClick={openForCreate}
                            className="mt-8 rounded-xl bg-violet-600 px-8 hover:bg-violet-700"
                        >
                            Crear ahora
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-violet-600"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-violet-100">
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                </div>
                                Volver al inicio
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                            {businesses.map((business: any) => (
                                <div
                                    key={business.id}
                                    className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-300 hover:border-violet-200 hover:shadow-md"
                                >
                                    {/* Área de Imagen Compacta */}
                                    <div className="relative aspect-[16/8] overflow-hidden">
                                        <img
                                            src={
                                                business.cover_image
                                                    ? `/storage/${business.cover_image}`
                                                    : `/images/${business.category.image}`
                                            }
                                            alt={business.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Badge Flotante Minimalista */}
                                        <div className="absolute top-2 left-2">
                                            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-black tracking-wider text-violet-700 uppercase shadow-sm backdrop-blur-md">
                                                {business.category.name}
                                            </span>
                                        </div>

                                        {/* Menú de Opciones (Solo visible en Hover para limpiar la vista) */}
                                        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm hover:text-violet-600">
                                                        <MoreVertical
                                                            size={14}
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40 rounded-lg border-slate-100 shadow-xl"
                                                >
                                                    <DropdownMenuItem
                                                        className="py-2 text-xs"
                                                        onClick={() =>
                                                            openForEdit(
                                                                business.id,
                                                                business,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-3.5 w-3.5 text-violet-500" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="py-2 text-xs"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/business/detail/${business.id}`}
                                                            target="_blank"
                                                        >
                                                            <ExternalLink className="mr-2 h-3.5 w-3.5 text-orange-500" />
                                                            Ver sitio
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
                                                        className="py-2 text-xs text-red-500"
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="line-clamp-1 text-sm font-bold text-slate-800 transition-colors group-hover:text-violet-600">
                                                {business.name}
                                            </h3>
                                        </div>

                                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                                            {business.slogan}
                                        </p>

                                        {/* Info de ubicación simplificada (sin fondo, solo icono y texto) */}
                                        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-50 pt-3">
                                            <MapPin
                                                size={10}
                                                className="text-slate-300"
                                            />
                                            <span className="truncate text-[9px] font-medium text-slate-400">
                                                {business.address}
                                            </span>
                                        </div>

                                        {/* Botón de acción: Más pequeño y elegante */}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="mt-3 h-8 w-full justify-between rounded-lg bg-slate-50 px-3 text-[11px] font-bold text-slate-600 transition-all hover:bg-violet-600 hover:text-white"
                                        >
                                            <Link
                                                href={`/dashboard/business/${business.id}/info-general`}
                                            >
                                                Gestionar panel
                                                <ChevronRight
                                                    size={12}
                                                    className="opacity-40"
                                                />
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Estado de carga integrado */}
                                    {loadingBusinessId === business.id && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                                            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
                <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-none p-0 shadow-2xl">
                    <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 to-orange-400" />

                    <DialogHeader className="px-8 pt-10 text-left">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xl shadow-violet-100">
                                {editingId ? (
                                    <Edit size={24} />
                                ) : (
                                    <Plus size={24} />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-slate-900">
                                    {editingId
                                        ? 'Editar Negocio'
                                        : 'Nuevo Negocio'}
                                </DialogTitle>
                                <DialogDescription className="font-medium text-slate-400">
                                    Completa la información para tu sucursal.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={handleOnSubmit}
                        className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2"
                    >
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Nombre
                            </Label>
                            <Input
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 transition-all focus:border-violet-500 focus:bg-white"
                                placeholder="Nombre de tu negocio"
                                value={formBusiness.data.name}
                                onChange={(e) =>
                                    formBusiness.setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Categoría
                            </Label>
                            <Select
                                value={formBusiness.data.category_id}
                                onValueChange={(v) =>
                                    formBusiness.setData('category_id', v)
                                }
                            >
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
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
                            <Label className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Ciudad
                            </Label>
                            <Select
                                value={formBusiness.data.location}
                                onValueChange={(v) =>
                                    formBusiness.setData('location', v)
                                }
                            >
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
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
                            <Label className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Eslogan
                            </Label>
                            <Input
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:border-violet-500"
                                value={formBusiness.data.slogan}
                                onChange={(e) =>
                                    formBusiness.setData(
                                        'slogan',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Teléfono
                            </Label>
                            <Input
                                type="tel"
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                                value={formBusiness.data.phone}
                                onChange={(e) =>
                                    formBusiness.setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-orange-100">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-slate-700">
                                    WhatsApp
                                </Label>
                                <p className="text-[10px] font-bold tracking-tighter text-orange-600 uppercase">
                                    Canal directo
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

                        <DialogFooter className="mt-6 flex gap-3 border-t border-slate-50 pt-8 sm:col-span-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={close}
                                className="h-12 rounded-xl px-6 font-bold text-slate-400 hover:text-slate-600"
                            >
                                Cancelar
                            </Button>
                            <Button
                                disabled={formBusiness.processing}
                                className="h-12 rounded-xl bg-violet-600 px-10 font-bold text-white shadow-xl shadow-violet-100 transition-all hover:bg-violet-700"
                            >
                                {formBusiness.processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Guardar Datos
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de eliminación simplificado */}
            <Dialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
            >
                <DialogContent className="max-w-sm rounded-[2rem] border-none p-8 text-center shadow-2xl">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <Trash2 size={32} />
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        ¿Estás seguro?
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-slate-500">
                        Esta acción borrará permanentemente el negocio.
                    </DialogDescription>
                    <div className="mt-8 flex flex-col gap-2">
                        <Button
                            variant="destructive"
                            className="h-12 rounded-xl font-bold shadow-lg shadow-red-100"
                            onClick={handleDelete}
                        >
                            Sí, eliminar negocio
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-12 rounded-xl font-bold text-slate-400"
                            onClick={() => setConfirmDeleteOpen(false)}
                        >
                            Mantenerlo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="light"
                toastClassName={() =>
                    'bg-white border-l-4 border-violet-600 shadow-2xl rounded-xl p-4 font-bold text-slate-800'
                }
            />
        </div>
    );
}
