import { formatTime, IconDynamic } from '@/lib/utils';
import { Business } from '@/types';
import { Clock, CreditCard, Globe, Share2, Sparkles } from 'lucide-react';

interface Props {
    business: Business;
}

export const InfoBusinessTab = ({ business }: Props) => {
    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 space-y-4">
                <div className="p-3">
                    <h3 className="mb-3 text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                        Sobre nosotros
                    </h3>
                    <p className="text-sm leading-relaxed font-normal text-gray-600">
                        {business.description ||
                            'Este establecimiento no ha proporcionado una descripción detallada aún.'}
                    </p>
                </div>

                {/* Etiquetas/Tags  */}
                {/* {(business?.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2 px-3">
                        {(business?.tags ?? []).map((tag: string) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-semibold text-purple-700 uppercase"
                            >
                                <Star className="h-3 w-3 fill-current" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )} */}

                {business.images && business.images.length > 0 && (
                    <div className="space-y-3 p-3">
                        <h3 className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                            Galería
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {business.images.map((img, index: number) => (
                                <div
                                    key={index}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-purple-100 bg-purple-50 shadow-sm"
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
                <div className="overflow-hidden rounded-lg border border-purple-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-700" />
                        <h3 className="text-sm font-semibold tracking-wider text-purple-800 uppercase">
                            Horarios
                        </h3>
                    </div>
                    {business?.schedules && business?.schedules.length > 0 ? (
                        <div className="space-y-2">
                            {business?.schedules.map((day: any) => {
                                const open = formatTime(day?.open);
                                const close = formatTime(day?.close);
                                return (
                                    <div
                                        key={day?.label}
                                        className="flex items-center justify-between text-[11px]"
                                    >
                                        <span className="font-semibold text-gray-500 capitalize">
                                            {day?.label}
                                        </span>
                                        <span
                                            className={`font-normal ${day?.isOpen ? 'text-gray-700' : 'text-amber-600 italic'}`}
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
                        <p className="text-[11px] text-gray-400 italic">
                            No disponibles
                        </p>
                    )}
                </div>

                <div className="space-y-6 rounded-lg border border-purple-200 bg-white p-4 shadow-sm">
                    {/* Amenidades */}
                    {business?.amenities && business?.amenities.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-700" />
                                <h3 className="text-[11px] font-semibold tracking-wider text-purple-800 uppercase">
                                    Amenidades
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {business?.amenities.map((service: any) => (
                                    <div
                                        key={service.id}
                                        className="flex items-center gap-2 text-[11px] text-gray-600"
                                    >
                                        <IconDynamic
                                            iconName={service.icon}
                                            className="h-3.5 w-3.5 text-purple-700"
                                        />
                                        <span className="font-normal">
                                            {service.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {business?.payments && business?.payments.length > 0 && (
                        <div className="border-t border-purple-50 pt-4">
                            <div className="mb-3 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-purple-700" />
                                <h3 className="text-[11px] font-semibold tracking-wider text-purple-800 uppercase">
                                    Pagos
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {business?.payments.map((payment: any) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center gap-2 text-[11px] text-gray-600"
                                    >
                                        <IconDynamic
                                            iconName={payment.icon}
                                            className="h-3.5 w-3.5 text-purple-700"
                                        />
                                        <span className="font-normal">
                                            {payment.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {Object.entries(business?.social_networks ?? {}).length > 0 && (
                    <div className="rounded-lg border border-purple-200 bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-purple-700" />
                            <h3 className="text-[11px] font-semibold tracking-wider text-purple-800 uppercase">
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
                                        className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-[10px] font-semibold text-purple-700 transition-all hover:bg-purple-600 hover:text-white active:scale-95"
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
