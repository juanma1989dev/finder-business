import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { makeBreadCrumb } from '@/helpers';
import { cn } from '@/lib/utils';
import { GalleryImage } from '@/types';
import { useForm } from '@inertiajs/react';
import { ImageIcon, Plus, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from './LayoutBusinessModules';

interface Props {
    business: any;
}

export default function Gallery({ business }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Galería`,
        url: '/',
    });

    const [images, setImages] = useState<GalleryImage[]>(() =>
        business.images.map((img: GalleryImage, index: number) => ({
            ...img,
            id: img.id || `existing-${index}-${Date.now()}`,
        })),
    );

    const { data, setData, post, processing } = useForm({
        images: [] as GalleryImage[],
    });

    useEffect(() => {
        setData('images', images);
    }, [images]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: GalleryImage[] = Array.from(files).map((file, i) => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
            file,
            url: URL.createObjectURL(file),
            is_primary: images.length === 0 && i === 0,
        }));

        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (idToRemove: string) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === idToRemove);
            if (img?.url.startsWith('blob:')) URL.revokeObjectURL(img.url);
            return prev.filter((i) => i.id !== idToRemove);
        });
    };

    const handleSetPrimary = (id: string) => {
        setImages((prev) =>
            prev.map((img) => ({ ...img, is_primary: img.id === id })),
        );
        toast.info('Imagen principal actualizada', {
            icon: (
                <Star className="fill-orange-500 text-orange-500" size={14} />
            ),
        });
    };

    const handleSaveGallery = () => {
        post(`/dashboard/business/${business.id}-${business.slug}/gallery`, {
            forceFormData: true,
            onSuccess: () =>
                toast.success('Galería sincronizada correctamente'),
        });
    };

    return (
        <LayoutBusinessModules
            titleHead="Galería"
            headerTitle="Galería Multimedia"
            headerDescription="Gestiona las fotos de tu negocio y selecciona la portada principal."
            buttonText="Guardar Galería"
            icon={ImageIcon}
            onSubmit={handleSaveGallery}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            {/* Panel de Carga - Ocupa 4 columnas */}
            <div className="lg:col-span-4">
                <input
                    type="file"
                    id="gallery-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <label
                    htmlFor="gallery-upload"
                    className="group flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 transition-all hover:border-orange-200 hover:bg-orange-50/30"
                >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 transition-transform group-hover:scale-110 group-hover:bg-orange-100">
                        <Plus
                            className="text-slate-400 group-hover:text-orange-600"
                            size={24}
                        />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">
                        Añadir Fotos
                    </span>
                    <span className="mt-1 text-[11px] text-slate-400">
                        JPG o PNG (Máx. 10MB por archivo)
                    </span>
                </label>
            </div>

            {/* Grid de Imágenes - Ocupa 8 columnas */}
            <div className="lg:col-span-8">
                {images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className={cn(
                                    'group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300',
                                    image.is_primary
                                        ? 'border-orange-500 shadow-md shadow-orange-100'
                                        : 'border-white bg-white shadow-sm hover:border-slate-200',
                                )}
                            >
                                <img
                                    src={
                                        image.url.startsWith('blob:')
                                            ? image.url
                                            : image.url.startsWith('http')
                                              ? image.url
                                              : `/storage/${image.url}`
                                    }
                                    alt="Preview"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Acciones al hacer Hover */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                                    {!image.is_primary && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="secondary"
                                            onClick={() =>
                                                handleSetPrimary(image.id)
                                            }
                                            className="h-9 w-9 rounded-xl bg-white/90 text-orange-600 hover:bg-white"
                                        >
                                            <Star
                                                size={16}
                                                className="fill-orange-500"
                                            />
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        onClick={() =>
                                            handleRemoveImage(image.id)
                                        }
                                        className="h-9 w-9 rounded-xl shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>

                                {/* Etiqueta de Portada */}
                                {image.is_primary && (
                                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-[9px] font-black tracking-tighter text-white uppercase shadow-lg">
                                        <Star
                                            size={10}
                                            className="fill-current"
                                        />
                                        Portada
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border-dashed border-slate-200 bg-slate-50/50 p-8 shadow-none">
                        <ImageIcon className="mb-2 h-10 w-10 text-slate-200" />
                        <p className="text-xs font-medium text-slate-400">
                            No hay fotos en la galería todavía
                        </p>
                    </Card>
                )}
            </div>
        </LayoutBusinessModules>
    );
}
