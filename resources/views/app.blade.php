<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class(['dark' => ($appearance ?? 'system') == 'dark'])
>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- 🌗 Detectar dark mode lo antes posible --}}
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';
            if (appearance === 'system') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- ⚡ CSS CRÍTICO PARA FCP (ESTO ES LA CLAVE) --}}
    <style>
        html {
            background-color: #ffffff;
        }
        html.dark {
            background-color: #0f0f0f;
        }

        body {
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* FCP Shell */
        .fcp-shell {
            padding: 16px;
        }

        .fcp-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
        }

        @media (min-width: 640px) {
            .fcp-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (min-width: 1024px) {
            .fcp-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        .fcp-card {
            height: 220px;
            border-radius: 24px;
            background: #f3f4f6;
            animation: pulse 1.5s ease-in-out infinite;
        }

        html.dark .fcp-card {
            background: #1f1f1f;
        }

        @keyframes pulse {
            0% { opacity: 1 }
            50% { opacity: .5 }
            100% { opacity: 1 }
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.webp" type="image/webp">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    {{-- ⚠️ Fonts no bloquean FCP --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link
        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap"
        rel="stylesheet"
    />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">

    {{-- ⚡ FCP CONTENT (SE VE ANTES DE JS) --}}
    <div id="fcp-shell" class="fcp-shell">
        <div class="fcp-grid">
            <div class="fcp-card"></div>
            <div class="fcp-card"></div>
            <div class="fcp-card"></div>
            <div class="fcp-card"></div>
            <div class="fcp-card"></div>
            <div class="fcp-card"></div>
        </div>
    </div>

    {{-- 🧠 Inertia monta aquí --}}
    @inertia

    {{-- ❌ Quitar FCP shell cuando React carga --}}
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            const shell = document.getElementById('fcp-shell');
            if (shell) shell.remove();
        });
    </script>

</body>
</html>
