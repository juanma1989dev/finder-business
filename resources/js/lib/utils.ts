import { type ClassValue, clsx } from 'clsx';
import * as Icons from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTime(time: string): string {
    try {
        const hours = parseInt(time.split(':')[0], 10);

        // Si la hora es la medianoche (00:xx), forzamos la salida.
        if (hours === 0) {
            // Obtenemos los minutos del string original
            const minutes = time.split(':')[1];
            // Devolvemos el formato personalizado "0:MM AM"
            return `0:${minutes} AM`;
        }

        // Para cualquier otra hora (01:xx a 23:xx), usamos el método estándar
        const date = new Date(`2000-01-01T${time}`);

        // toLocaleTimeString con opciones para 12 horas
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric', // Muestra la hora (ej: 7)
            minute: '2-digit', // Muestra los minutos (ej: 00)
            hour12: true, // Asegura el formato AM/PM
        });
    } catch (error) {
        return time; // Devuelve el valor original en caso de error
    }
}

interface IconDynamicProps {
    iconName: string;
    className?: string;
}

export const IconDynamic: React.FC<IconDynamicProps> = ({
    iconName,
    className,
}) => {
    const Icon = (Icons as any)[iconName] || Icons.HelpCircle;

    return React.createElement(Icon, {
        className: className || 'h-4 w-4 text-orange-600',
    });
};
