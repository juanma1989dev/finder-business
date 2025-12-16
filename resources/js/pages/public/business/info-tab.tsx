import { formatTime, IconDynamic } from '@/lib/utils';
import { Business } from '@/types';
import { Badge, Globe, Star } from 'lucide-react';

interface Props {
    business: Business;
}

export const InfoBusinessTab = ({ business }: Props) => {
    return (
        <div className="flex flex-col gap-3 md:flex-row">
            <div className="w-full md:w-4/6">
                {/* Descripcion */}
                <p className="max-w-2xl leading-relaxed text-gray-600">
                    {business.long_description}
                </p>

                {/* Tags */}
                <div className="my-4 flex w-full justify-center gap-3">
                    {business?.tags?.length > 0 &&
                        business.tags.map((tag: string) => (
                            <Badge
                                className="flex items-center justify-center bg-slate-300/60 p-1 font-semibold text-orange-600 capitalize"
                                key={tag}
                            >
                                <Star className="font-semibold text-orange-600" />
                                {tag}
                            </Badge>
                        ))}
                </div>

                {/* Imagenes */}
                {business.images && business.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-3">
                        {business.images.map((img, index: number) => (
                            <div
                                key={index}
                                className="h-32 w-full overflow-hidden rounded-lg border"
                            >
                                <img
                                    src={`/storage/${img.url}`}
                                    alt={`Imagen ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full gap-2 space-y-2 md:w-2/6">
                <div className="rounded-xl bg-gray-50 p-3">
                    <h3 className="mt-2 mb-2 text-center font-semibold text-gray-800">
                        Horarios
                    </h3>
                    {business?.schedules && business?.schedules.length > 0 ? (
                        <div className="space-y-2">
                            {business?.schedules.map((day: any) => {
                                const open = formatTime(day?.open);

                                const close = formatTime(day?.close);

                                const horarioStr = day?.isOpen
                                    ? `${open} - ${close}`
                                    : 'Cerrado';

                                return (
                                    <div
                                        key={day?.label}
                                        className="flex items-center justify-between border-b border-gray-200 py-1 text-sm last:border-b-0"
                                    >
                                        <span className="font-medium text-gray-700 capitalize">
                                            {day?.label}
                                        </span>
                                        <div className="flex items-center">
                                            <span className="text-gray-600">
                                                {horarioStr}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">
                            No disponibles.
                        </p>
                    )}
                </div>

                {/* Amenidades */}
                {business?.amenities && business?.amenities.length > 0 && (
                    <div className="rounded-xl bg-gray-50 p-3">
                        <h3 className="mt-2 mb-2 text-center font-semibold text-gray-800">
                            Amenidades
                        </h3>
                        <div className="space-y-2">
                            {business?.amenities.map((service: any) => (
                                <div
                                    key={service.id}
                                    className="flex items-center space-x-2"
                                >
                                    <IconDynamic
                                        iconName={service.icon}
                                        className="h-4 w-4 text-orange-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {service.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Metodos de pago */}
                {business?.payments && business?.payments.length > 0 && (
                    <div className="rounded-xl bg-gray-50 p-3">
                        <h3 className="mt-2 mb-2 text-center font-semibold text-gray-800">
                            Metodos de pago
                        </h3>
                        <div className="space-y-2">
                            {business?.payments.map((payment: any) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center space-x-2"
                                >
                                    <IconDynamic
                                        iconName={payment.icon}
                                        className="h-4 w-4 text-orange-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {payment.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {Object.entries(business?.social_networks ?? {}).length > 0 && (
                    <div className="rounded-xl bg-gray-50 p-3">
                        <h3 className="mt-2 mb-3 text-center font-semibold text-gray-800">
                            Síguenos en
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {Object.entries(business.social_networks ?? {}).map(
                                ([key, url]) => (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-orange-100 hover:text-orange-600"
                                    >
                                        <Globe className="h-4 w-4" />
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
