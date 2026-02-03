import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react({
            babel: {
                plugins: [
                    // elimina helpers innecesarios
                    ['@babel/plugin-transform-runtime', { helpers: false }],
                ],
            },
        }),
        tailwindcss(),
        wayfinder({ formVariants: true }),
    ],

    build: {
        target: 'es2018',
        minify: 'esbuild',
        cssCodeSplit: true,
        sourcemap: false,

        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'react';
                        if (id.includes('@inertiajs')) return 'inertia';
                        if (id.includes('lucide-react')) return 'icons';
                        if (id.includes('date-fns')) return 'dates';
                        return 'vendor';
                    }
                },
            },
        },
    },

    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react'],
        exclude: ['lucide-react'],
    },

    esbuild: {
        drop: ['console', 'debugger'],
        jsx: 'automatic',
    },

    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: { host: 'localhost' },
    },
});
