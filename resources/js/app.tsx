import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    // resolve: (name) =>
    //     resolvePageComponent(
    //         `./pages/${name}.tsx`,
    //         import.meta.glob('./pages/**/*.tsx'),
    //     ),

    resolve: (name) => {
        // Importamos el mapa de páginas
        const pages = import.meta.glob('./pages/**/*.tsx');

        // Buscamos la página específica
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ./pages/${name}.tsx`);
        }

        // Retornamos la función que carga el componente dinámicamente
        return typeof page === 'function' ? page() : page;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);

        requestAnimationFrame(() => {
            const shell = document.getElementById('fcp-shell');

            if (shell) {
                shell.style.opacity = '0';

                setTimeout(() => {
                    shell.remove();
                }, 250);
            }
        });
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
