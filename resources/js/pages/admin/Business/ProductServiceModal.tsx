import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ProductExtras, ProductVariations, ServicesAndProducts } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Image as ImageIcon,
    Layers,
    LoaderCircle,
    Package,
    Plus,
    Save,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
    open: boolean;
    onClose: () => void;
    businessId: string;
    service: ServicesAndProducts | null;
    onSuccess: () => void;
}

export default function ProductServiceModal({
    open,
    onClose,
    businessId,
    service,
    onSuccess,
}: Props) {
    const form = useForm({
        name: '',
        description: '',
        price: 0,
        duration: '',
        category: 'Product',
        isActive: true,
        image: undefined as File | undefined,
        image_url: '',
        extras: [] as ProductExtras[],
        variations: [] as ProductVariations[],
    });

    useEffect(() => {
        if (!open) return;
        if (service) {
            form.setData({
                name: service.name ?? '',
                description: service.description ?? '',
                price: service.price ?? 0,
                duration: service.duration ?? '',
                category: service.category ?? 'Product',
                isActive: service.isActive ?? true,
                image: undefined,
                image_url: service.image_url ?? '',
                extras: service.extras ?? [],
                variations: service.variations ?? [],
            });
        } else {
            form.reset();
            form.clearErrors();
        }
    }, [open, service]);

    const handleSubmit = () => {
        const isEdit = Boolean(service);
        const url = isEdit
            ? `/dashboard/business/${businessId}/services/${service?.id}`
            : `/dashboard/business/${businessId}/services`;

        form.post(url, {
            forceFormData: true,
            // ignore error

            data: isEdit ? { ...form.data, _method: 'PUT' } : form.data,
            onSuccess: () => {
                toast.success(
                    isEdit
                        ? 'Actualizado correctamente'
                        : 'Creado correctamente',
                );
                onClose();
                onSuccess();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl overflow-hidden rounded-[2rem] border-none bg-gray-50 p-0 shadow-2xl">
                {/* Header con gradiente sutil */}
                <div className="bg-white px-8 pt-8 pb-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                {service ? (
                                    <Sparkles size={24} />
                                ) : (
                                    <Plus size={24} />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">
                                    {service
                                        ? 'Editar Producto'
                                        : 'Nuevo Producto'}
                                </DialogTitle>
                                <p className="text-sm font-medium text-gray-500">
                                    Configura los detalles de tu oferta
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <div className="bg-white px-8">
                        <TabsList className="flex h-auto w-full justify-start gap-8 bg-transparent p-0">
                            {[
                                {
                                    id: 'general',
                                    label: 'General',
                                    icon: Package,
                                },
                                {
                                    id: 'variations',
                                    label: 'Variaciones',
                                    icon: Layers,
                                },
                                {
                                    id: 'extras',
                                    label: 'Extras / Toppings',
                                    icon: Plus,
                                },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent px-1 pb-4 text-sm font-bold text-gray-400 transition-all data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-600"
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto px-8 py-6">
                        {/* CONTENIDO GENERAL */}
                        <TabsContent value="general" className="mt-0 space-y-8">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                            Nombre del producto
                                        </Label>
                                        <Input
                                            value={form.data.name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 rounded-xl border-gray-200 bg-white px-4 shadow-sm focus:ring-orange-500"
                                            placeholder="Ej: Hamburguesa Especial"
                                        />
                                        {form.errors.name && (
                                            <p className="text-xs font-bold text-red-500">
                                                {form.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                            Precio Base ($)
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-gray-400">
                                                $
                                            </span>
                                            <Input
                                                type="number"
                                                value={form.data.price}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'price',
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="h-12 rounded-xl border-gray-200 bg-white pl-8 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                        Imagen del producto
                                    </Label>
                                    <div
                                        onClick={() =>
                                            document
                                                .getElementById('image-upload')
                                                ?.click()
                                        }
                                        className="group relative flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-200 bg-white transition-all hover:border-orange-400 hover:bg-orange-50/50"
                                    >
                                        {form.data.image ||
                                        form.data.image_url ? (
                                            <img
                                                src={
                                                    form.data.image
                                                        ? URL.createObjectURL(
                                                              form.data.image,
                                                          )
                                                        : form.data.image_url
                                                }
                                                className="h-full w-full rounded-[1.8rem] object-cover p-2"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <ImageIcon
                                                    size={32}
                                                    className="group-hover:text-orange-500"
                                                />
                                                <span className="text-xs font-bold">
                                                    Click para subir foto
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                form.setData(
                                                    'image',
                                                    e.target.files?.[0],
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                    Descripción
                                </Label>
                                <Textarea
                                    rows={3}
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    className="rounded-2xl border-gray-200 bg-white p-4 shadow-sm"
                                    placeholder="Describe los ingredientes o detalles importantes..."
                                />
                            </div>

                            <div
                                className={`flex items-center gap-3 rounded-2xl p-4 transition-colors ${form.data.isActive ? 'bg-green-50' : 'bg-gray-100'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.data.isActive}
                                    onChange={(e) =>
                                        form.setData(
                                            'isActive',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-6 w-6 rounded-lg border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <div className="flex flex-col">
                                    <Label className="text-sm font-black text-gray-900">
                                        Producto Activo
                                    </Label>
                                    <span className="text-xs font-medium text-gray-500">
                                        Los clientes podrán ver y pedir este
                                        producto
                                    </span>
                                </div>
                            </div>
                        </TabsContent>

                        {/* VARIACIONES (Mismo estilo de tarjetas) */}
                        <TabsContent
                            value="variations"
                            className="mt-0 space-y-4"
                        >
                            <div className="rounded-2xl bg-blue-50 p-4 text-blue-700">
                                <p className="text-xs font-bold">
                                    Usa las variaciones para opciones
                                    obligatorias como "Tamaño" (Pequeño,
                                    Grande).
                                </p>
                            </div>
                            {form.data.variations.map((varia, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm animate-in fade-in slide-in-from-top-2"
                                >
                                    <Input
                                        value={varia.name}
                                        placeholder="Ej: Familiar, Personal..."
                                        className="h-10 border-none bg-transparent font-bold shadow-none focus-visible:ring-0"
                                        onChange={(e) => {
                                            const v = [...form.data.variations];
                                            v[index].name = e.target.value;
                                            form.setData('variations', v);
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => {
                                            const v = [...form.data.variations];
                                            v.splice(index, 1);
                                            form.setData('variations', v);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full rounded-2xl border-2 border-dashed py-6 hover:bg-gray-100"
                                onClick={() =>
                                    form.setData('variations', [
                                        ...form.data.variations,
                                        { name: '' },
                                    ])
                                }
                            >
                                <Plus size={18} className="mr-2" /> Agregar
                                Variación
                            </Button>
                        </TabsContent>

                        {/* EXTRAS */}
                        <TabsContent value="extras" className="mt-0 space-y-4">
                            {form.data.extras.map((extra, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[1fr_120px_auto] items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
                                >
                                    <Input
                                        value={extra.name}
                                        placeholder="Nombre del extra"
                                        className="h-10 border-none font-bold shadow-none focus-visible:ring-0"
                                        onChange={(e) => {
                                            const ex = [...form.data.extras];
                                            ex[index].name = e.target.value;
                                            form.setData('extras', ex);
                                        }}
                                    />
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-gray-400">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            value={extra.price}
                                            className="h-10 rounded-xl bg-gray-50 pl-7 text-sm font-bold shadow-none"
                                            onChange={(e) => {
                                                const ex = [
                                                    ...form.data.extras,
                                                ];
                                                ex[index].price = Number(
                                                    e.target.value,
                                                );
                                                form.setData('extras', ex);
                                            }}
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-600"
                                        onClick={() => {
                                            const ex = [...form.data.extras];
                                            ex.splice(index, 1);
                                            form.setData('extras', ex);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full rounded-2xl border-2 border-dashed py-6 hover:bg-gray-100"
                                onClick={() =>
                                    form.setData('extras', [
                                        ...form.data.extras,
                                        { name: '', price: 0 },
                                    ])
                                }
                            >
                                <Plus size={18} className="mr-2" /> Agregar
                                Topping / Extra
                            </Button>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Footer Fijo */}
                <div className="flex items-center justify-between border-t bg-white px-8 py-6">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                    >
                        Descartar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={form.processing}
                        className="h-12 rounded-[1.2rem] bg-orange-600 px-8 font-black text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-700 active:scale-95"
                    >
                        {form.processing ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Save className="mr-2" size={18} />
                        )}
                        {service ? 'Guardar Cambios' : 'Publicar Producto'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
