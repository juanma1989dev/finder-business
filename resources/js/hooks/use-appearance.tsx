import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light'; // Solo permitimos light

const applyTheme = () => {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
    }
};

export function initializeTheme() {
    applyTheme();
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('appearance');
    }
}

export function useAppearance() {
    const [appearance] = useState<Appearance>('light');

    const updateAppearance = useCallback(() => {
        applyTheme();
    }, []);

    useEffect(() => {
        applyTheme();
    }, []);

    return { appearance, updateAppearance: () => {} } as const;
}
