import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        // Optimización de la velocidad de ejecución
        target: 'esnext',
        // Reducción de tamaño mediante fragmentación manual
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Separamos las librerías core de React e Inertia
                    if (
                        id.includes('node_modules/react/') ||
                        id.includes('node_modules/react-dom/') ||
                        id.includes('node_modules/@inertiajs/')
                    ) {
                        return 'vendor-core';
                    }
                    // Lucide-react es muy pesado, lo ponemos en su propio archivo
                    if (id.includes('node_modules/lucide-react')) {
                        return 'vendor-icons';
                    }
                    // Componentes de Radix UI y utilidades de Shadcn
                    if (
                        id.includes('node_modules/@radix-ui') ||
                        id.includes('clsx') ||
                        id.includes('tailwind-merge')
                    ) {
                        return 'vendor-ui';
                    }
                },
            },
            treeshake: 'smallest',
        },
        // Mejora el reporte de archivos grandes
        chunkSizeWarningLimit: 800,
    },
});
