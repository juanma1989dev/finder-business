import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { makeBreadCrumb } from '@/helpers';
import { Business } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Facebook,
    Globe,
    Instagram,
    Link2,
    Music2,
    Share2,
    Twitter,
    Youtube,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from '../LayoutBusinessModules';

interface Props {
    business: Business;
}

export default function SocialNetworks({ business }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Redes Sociales`,
        url: '/',
    });

    const initialSocialLinks = {
        web: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
    };

    const { data, put, processing, setData } = useForm({
        ...initialSocialLinks,
        ...(business.social_networks ?? {}),
    });

    const handleSubmit = () => {
        put(
            `/dashboard/business/${business.id}${business.slug}/social-networks`,
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success('Enlaces actualizados correctamente'),
            },
        );
    };

    const socialPlatforms = [
        {
            key: 'web',
            label: 'Sitio Web',
            icon: Globe,
            color: 'text-purple-700',
            bg: 'bg-purple-50',
        },
        {
            key: 'facebook',
            label: 'Facebook',
            icon: Facebook,
            color: 'text-[#1877F2]',
            bg: 'bg-[#1877F2]/10',
        },
        {
            key: 'instagram',
            label: 'Instagram',
            icon: Instagram,
            color: 'text-[#E4405F]',
            bg: 'bg-[#E4405F]/10',
        },
        {
            key: 'twitter',
            label: 'Twitter / X',
            icon: Twitter,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
        },
        {
            key: 'youtube',
            label: 'YouTube',
            icon: Youtube,
            color: 'text-[#FF0000]',
            bg: 'bg-[#FF0000]/10',
        },
        {
            key: 'tiktok',
            label: 'TikTok',
            icon: Music2,
            color: 'text-gray-800',
            bg: 'bg-gray-100',
        },
    ] as const;

    return (
        <LayoutBusinessModules
            titleHead="Redes Sociales"
            headerTitle="Presencia Digital"
            headerDescription="Gestiona los enlaces a tus redes sociales y sitio web oficial."
            buttonText="Guardar"
            icon={Share2}
            onSubmit={handleSubmit}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            <div className="space-y-6 lg:col-span-12">
                {/* Formulario en Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {socialPlatforms.map(
                        ({ key, label, icon: Icon, color, bg }) => (
                            <Card
                                key={key}
                                /* ESTRUCTURA: rounded-lg, border-purple-200, shadow-sm */
                                className="group relative overflow-hidden rounded-lg border-purple-100 bg-white p-3 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icono de Plataforma: bg-purple-50 y text-purple-700 */}
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${bg} ${color}`}
                                    >
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            {/* TIPOGRAFÍA: Tamaño Micro text-[10px] */}
                                            <Label
                                                htmlFor={key}
                                                className="text-[10px] leading-tight font-semibold tracking-widest text-gray-500 uppercase"
                                            >
                                                {label}
                                            </Label>

                                            {/* Paleta Éxito: text-green-600 */}
                                            {data[key] && (
                                                <div className="flex animate-pulse items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-600">
                                                    <Link2 size={10} />
                                                    Activo
                                                </div>
                                            )}
                                        </div>
                                        <Input
                                            id={key}
                                            type="url"
                                            value={data[key] || ''}
                                            onChange={(e) =>
                                                setData(key, e.target.value)
                                            }
                                            placeholder={`https://${key}.com/...`}
                                            /* Estilo Micro en Input para URL */
                                            className="h-8 border-none bg-transparent px-0 text-xs font-normal text-gray-700 shadow-none placeholder:text-gray-300 focus-visible:ring-0"
                                        />
                                        {/* Borde dinámico: bg-purple-600 al hacer focus */}
                                        <div className="h-[1.5px] w-full bg-gray-100 transition-colors group-focus-within:bg-purple-600" />
                                    </div>
                                </div>
                            </Card>
                        ),
                    )}
                </form>

                {/* Info Box: Paleta Amber (Alertas/Advertencias) */}
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="mt-0.5 rounded-full bg-amber-100 p-1 text-amber-600">
                        <Globe size={14} />
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-amber-700">
                            Validación de enlaces
                        </h4>
                        <p className="mt-1 text-[11px] leading-tight font-normal text-amber-700/80">
                            Asegúrate de incluir el protocolo{' '}
                            <strong className="font-semibold text-amber-800">
                                https://
                            </strong>{' '}
                            al inicio de cada URL. Esto permite que los iconos
                            de tu perfil público dirijan correctamente a tus
                            clientes.
                        </p>
                    </div>
                </div>
            </div>
        </LayoutBusinessModules>
    );
}
