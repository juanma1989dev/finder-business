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
import { messaging, onMessage } from '@/firebase';
import { useDialog } from '@/hooks/useDialog';
import { Business as BusinessType, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Edit,
    ExternalLink,
    Loader2,
    MapPin,
    MoreVertical,
    Plus,
    Save,
    Store,
    Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    businesses: BusinessType[];
    catalogs: {
        categories: any[];
    };
}

const LIMIT_BUSINESSES = 1;

export default function Business({ businesses, catalogs }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { user } = auth;

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

    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            const title =
                payload.notification?.title ||
                payload.data?.title ||
                'Nuevo pedido';
            const body = payload.notification?.body || payload.data?.body || '';

            toast.success(
                <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-[10px]">{body}</p>
                </div>,
            );
        });

        return () => unsubscribe();
    }, []);

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
        <div className="min-h-screen bg-purple-50/30">
            <header className="sticky top-0 z-40 w-full border-b border-purple-100 bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md shadow-purple-200">
                            <Store size={22} />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold tracking-tight text-gray-700 uppercase">
                                Mis Negocios
                            </h1>
                            <div className="flex items-center gap-1.5 leading-none">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                                <p className="text-[10px] font-semibold tracking-widest text-purple-600 uppercase">
                                    Panel de Gestión
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {businesses.length < LIMIT_BUSINESSES && (
                            <Button
                                onClick={openForCreate}
                                className="rounded-lg bg-purple-600 px-4 text-[10px] font-semibold tracking-widest text-white uppercase shadow-sm transition-all hover:bg-purple-700 active:scale-95"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Nuevo negocio
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {businesses.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white p-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-50">
                            <Plus className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700 uppercase">
                            Empieza tu aventura
                        </h3>
                        <p className="mt-1 text-[10px] font-normal tracking-widest text-gray-500 uppercase">
                            Crea tu primera sucursal para que todos te vean.
                        </p>
                        <Button
                            onClick={openForCreate}
                            className="mt-6 rounded-lg bg-purple-600 px-8 text-xs font-semibold text-white uppercase hover:bg-purple-700 active:scale-95"
                        >
                            Crear ahora
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {businesses.map((business: any) => (
                                <div
                                    key={business.id}
                                    className="group relative flex flex-col overflow-hidden rounded-lg border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden bg-purple-50">
                                        <img
                                            src={
                                                business.cover_image
                                                    ? `/storage/${business.cover_image}`
                                                    : `/images/${business.category.image}`
                                            }
                                            alt={business.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <span className="rounded-lg bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-purple-700 uppercase shadow-sm backdrop-blur-sm">
                                                {business.category.name}
                                            </span>
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-gray-600 shadow-sm hover:text-purple-600 active:scale-90">
                                                        <MoreVertical
                                                            size={14}
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40 rounded-lg border-purple-100"
                                                >
                                                    <DropdownMenuItem
                                                        className="text-[10px] font-semibold uppercase"
                                                        onClick={() =>
                                                            openForEdit(
                                                                business.id,
                                                                business,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-3.5 w-3.5 text-purple-600" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-[10px] font-semibold uppercase"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/business/detail/${business.id}`}
                                                            target="_blank"
                                                        >
                                                            <ExternalLink className="mr-2 h-3.5 w-3.5 text-amber-500" />
                                                            Ver sitio
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-purple-50" />
                                                    <DropdownMenuItem
                                                        className="text-[10px] font-semibold text-red-600 uppercase"
                                                        onClick={() => {
                                                            setBusinessToDelete(
                                                                business.id,
                                                            );
                                                            setConfirmDeleteOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-4">
                                        <h3 className="line-clamp-1 text-sm font-semibold text-purple-900 group-hover:text-purple-600">
                                            {business.name}
                                        </h3>
                                        <p className="mt-1 line-clamp-1 text-[10px] leading-tight font-normal tracking-wide text-gray-500 uppercase">
                                            {business.slogan}
                                        </p>

                                        <div className="mt-4 flex items-center gap-1.5 border-t border-purple-50 pt-3">
                                            <MapPin
                                                size={12}
                                                className="text-purple-400"
                                            />
                                            <span className="truncate text-[10px] font-medium tracking-tighter text-gray-400 uppercase">
                                                {business.address}
                                            </span>
                                        </div>

                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="mt-4 h-9 w-full justify-between rounded-lg bg-purple-50 px-3 text-[10px] font-semibold tracking-widest text-purple-700 uppercase transition-all hover:bg-purple-600 hover:text-white"
                                        >
                                            <Link
                                                href={`/dashboard/business/${business.id}-${business.slug}/home`}
                                            >
                                                Gestionar negocio
                                                <ChevronRight
                                                    size={14}
                                                    className="opacity-50"
                                                />
                                            </Link>
                                        </Button>
                                    </div>

                                    {loadingBusinessId === business.id && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                                            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
                <DialogContent className="max-w-2xl overflow-hidden rounded-lg border-none p-0 shadow-2xl">
                    <div className="h-0.5 w-full bg-purple-600" />
                    <DialogHeader className="px-4 pt-6 text-left">
                        <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-lg">
                                {editingId ? (
                                    <Edit size={16} />
                                ) : (
                                    <Plus size={16} />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold tracking-tight text-gray-800 uppercase">
                                    {editingId
                                        ? 'Editar Negocio'
                                        : 'Nuevo Negocio'}
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-normal tracking-widest text-gray-500 uppercase">
                                    Información de sucursal
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={handleOnSubmit}
                        className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2"
                    >
                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                Nombre
                            </Label>
                            <Input
                                className="rounded-lg border-purple-100 bg-purple-50/30 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                                value={formBusiness.data.name}
                                onChange={(e) =>
                                    formBusiness.setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                Categoría
                            </Label>
                            <Select
                                value={formBusiness.data.category_id}
                                onValueChange={(v) =>
                                    formBusiness.setData('category_id', v)
                                }
                            >
                                <SelectTrigger className="rounded-lg border-purple-100 bg-purple-50/30 text-xs">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-purple-100">
                                    {catalogs?.categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                            className="text-xs"
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                Ciudad
                            </Label>
                            <Select
                                value={formBusiness.data.location}
                                onValueChange={(v) =>
                                    formBusiness.setData('location', v)
                                }
                            >
                                <SelectTrigger className="rounded-lg border-purple-100 bg-purple-50/30 text-xs">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-purple-100">
                                    {Object.entries(locations).map(
                                        ([key, loc]) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="text-xs"
                                            >
                                                {loc.name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                Eslogan
                            </Label>
                            <Input
                                className="rounded-lg border-purple-100 bg-purple-50/30 text-sm focus:border-purple-600"
                                value={formBusiness.data.slogan}
                                onChange={(e) =>
                                    formBusiness.setData(
                                        'slogan',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                Teléfono
                            </Label>
                            <Input
                                type="tel"
                                className="rounded-lg border-purple-100 bg-purple-50/30 text-sm"
                                value={formBusiness.data.phone}
                                onChange={(e) =>
                                    formBusiness.setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-purple-100 bg-purple-50/50 p-2">
                            <div>
                                <Label className="text-[10px] font-semibold text-purple-900 uppercase">
                                    WhatsApp
                                </Label>
                                <p className="text-[10px] font-semibold tracking-tighter text-amber-600 uppercase">
                                    Canal directo
                                </p>
                            </div>
                            <Switch
                                checked={formBusiness.data.use_whatsapp}
                                onCheckedChange={(v) =>
                                    formBusiness.setData('use_whatsapp', v)
                                }
                                className="data-[state=checked]:bg-purple-600"
                            />
                        </div>

                        <DialogFooter className="mt-4 gap-2 sm:col-span-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={close}
                                className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                            >
                                Cancelar
                            </Button>
                            <Button
                                disabled={formBusiness.processing}
                                className="rounded-lg bg-purple-600 px-8 text-[10px] font-semibold tracking-widest text-white uppercase hover:bg-purple-700 active:scale-95"
                            >
                                {formBusiness.processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Guardar Datos
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
            >
                <DialogContent className="max-w-sm rounded-lg border-none p-6 text-center shadow-2xl">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <Trash2 size={28} />
                    </div>
                    <DialogTitle className="text-base font-semibold tracking-tight text-gray-800 uppercase">
                        ¿Estás seguro?
                    </DialogTitle>
                    <DialogDescription className="text-[14px] leading-tight font-normal tracking-widest text-gray-900 uppercase">
                        Esta acción borrará permanentemente el negocio.
                    </DialogDescription>
                    <div className="mt-6 flex flex-col gap-2">
                        <Button
                            variant="destructive"
                            className="rounded-lg py-6 text-xs font-semibold tracking-widest uppercase active:scale-95"
                            onClick={handleDelete}
                        >
                            Sí, eliminar negocio
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                            onClick={() => setConfirmDeleteOpen(false)}
                        >
                            Mantenerlo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="light"
            /> */}
        </div>
    );
}
