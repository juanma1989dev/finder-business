import { BreadcrumbItem } from '@/types';

export function getMetaValue<T>(
    meta: Record<string, unknown> | undefined,
    key: string,
): T | undefined {
    const value = meta?.[key];
    return value as T | undefined;
}

export const makeBreadCrumb = ({
    text,
    url,
}: {
    text: string;
    url: string;
}): BreadcrumbItem[] => {
    return [
        {
            title: text,
            href: url,
        },
    ];
};

export const formatHour = function (time: string) {
    return new Date(`1970-01-01T${time}`)
        .toLocaleTimeString('es-MX', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        .toLowerCase();
};
