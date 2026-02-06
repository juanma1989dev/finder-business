<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        
        <link rel="icon" href="/favicon.webp" type="image/webp">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        {{-- Preconectar a fuentes para ahorrar ~200ms --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />


        <style>
            html { background-color: #ffffff; }
            /* html.dark { background-color: #0a0a0a; } */

            /* Estilos críticos para el Esqueleto Inicial (FCP) */
            #fcp-shell {
                position: fixed;
                inset: 0;
                background: white;
                z-index: 50;
                display: flex;
                flex-direction: column;
                pointer-events: none;
                transition: opacity 0.3s ease-out;
            }

            .shell-header {
                height: 72px;
                padding: 16px;
                display: flex;
                gap: 12px;
                border-bottom: 1px solid #f3f4f6;
            }

            .shell-circle { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; }
            .shell-bar { flex: 1; height: 40px; border-radius: 20px; background: #f3f4f6; }

            .shell-grid {
                padding: 16px;
                display: grid;
                gap: 16px;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            }

            .shell-card {
                height: 280px;
                border-radius: 24px;
                background: #f3f4f6;
                position: relative;
                overflow: hidden;
            }

            /* Animación Shimmer suave */
            .shell-card::after {
                content: "";
                position: absolute;
                inset: 0;
                transform: translateX(-100%);
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                100% { transform: translateX(100%); }
            }
        </style>

        <link rel="manifest" href="pwa.manifest.json">
        <meta name="theme-color" content="#7c3aed">

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <div id="fcp-shell">
            <div class="shell-header">
                <div class="shell-circle"></div>
                <div class="shell-bar"></div>
                <div class="shell-circle"></div>
            </div>
            <div class="shell-grid">
                <div class="shell-card"></div>
                <div class="shell-card"></div>
                <div class="shell-card"></div>
            </div>
        </div>

        @inertia
    </body>
</html>