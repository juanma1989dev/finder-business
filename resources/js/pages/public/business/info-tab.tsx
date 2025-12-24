import { formatTime, IconDynamic } from '@/lib/utils';
import { Business } from '@/types';
import { Clock, CreditCard, Globe, Share2, Sparkles, Star } from 'lucide-react';

interface Props {
    business: Business;
}

export const InfoBusinessTab = ({ business }: Props) => {
    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-8">
                <div>
                    <h3 className="mb-3 text-sm font-black tracking-widest text-gray-400 uppercase">
                        Sobre nosotros
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
                        {business.description ||
                            'Este establecimiento no ha proporcionado una descripción detallada aún.'}
                    </p>
                </div>

                {(business?.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {(business?.tags ?? []).map((tag: string) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-600 uppercase"
                            >
                                <Star className="h-3 w-3 fill-current" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Galería de Imágenes */}
                {business.images && business.images.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-black tracking-widest text-gray-400 uppercase">
                            Galería
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {business.images.map((img, index: number) => (
                                <div
                                    key={index}
                                    className="group relative aspect-square overflow-hidden rounded-[1.5rem] border border-gray-100 bg-gray-50 shadow-sm"
                                >
                                    <img
                                        src={`/storage/${img.url}`}
                                        alt={`Imagen ${index + 1}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full space-y-4 lg:w-[320px]">
                {/* Horarios */}
                <div className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-gray-900">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <h3 className="text-sm font-black tracking-wider uppercase">
                            Horarios
                        </h3>
                    </div>
                    {business?.schedules && business?.schedules.length > 0 ? (
                        <div className="space-y-3">
                            {business?.schedules.map((day: any) => {
                                const open = formatTime(day?.open);
                                const close = formatTime(day?.close);
                                return (
                                    <div
                                        key={day?.label}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <span className="font-bold text-gray-500 capitalize">
                                            {day?.label}
                                        </span>
                                        <span
                                            className={`font-medium ${day?.isOpen ? 'text-gray-700' : 'text-red-400 italic'}`}
                                        >
                                            {day?.isOpen
                                                ? `${open} - ${close}`
                                                : 'Cerrado'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">
                            No disponibles
                        </p>
                    )}
                </div>

                {/* Amenidades y Pagos combinados */}
                <div className="space-y-6 rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
                    {/* Amenidades */}
                    {business?.amenities && business?.amenities.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center gap-2 text-gray-900">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                <h3 className="text-sm text-[11px] font-black tracking-wider uppercase">
                                    Amenidades
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {business?.amenities.map((service: any) => (
                                    <div
                                        key={service.id}
                                        className="flex items-center gap-2 text-xs text-gray-600"
                                    >
                                        <IconDynamic
                                            iconName={service.icon}
                                            className="h-3.5 w-3.5 text-gray-400"
                                        />
                                        <span>{service.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Métodos de Pago */}
                    {business?.payments && business?.payments.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center gap-2 border-t border-gray-50 pt-4 text-gray-900">
                                <CreditCard className="h-4 w-4 text-purple-600" />
                                <h3 className="text-sm text-[11px] font-black tracking-wider uppercase">
                                    Pagos
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {business?.payments.map((payment: any) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center gap-2 text-xs text-gray-600"
                                    >
                                        <IconDynamic
                                            iconName={payment.icon}
                                            className="h-3.5 w-3.5 text-gray-400"
                                        />
                                        <span>{payment.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Redes Sociales */}
                {Object.entries(business?.social_networks ?? {}).length > 0 && (
                    <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 text-gray-900">
                            <Share2 className="h-4 w-4 text-purple-600" />
                            <h3 className="text-sm text-[11px] font-black tracking-wider uppercase">
                                Síguenos
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(business.social_networks ?? {}).map(
                                ([key, url]) => (
                                    <a
                                        key={key}
                                        href={url as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-700 transition-all hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        <Globe className="h-3 w-3" />
                                        <span className="capitalize">
                                            {key}
                                        </span>
                                    </a>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
