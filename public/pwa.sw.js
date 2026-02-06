const CACHE_NAME = 'vite-assets-v1';
const TILE_CACHE = 'leaflet-tiles-v1';
const MAX_TILES = 300;

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter(
                            (key) => ![CACHE_NAME, TILE_CACHE].includes(key),
                        )
                        .map((key) => caches.delete(key)),
                ),
            ),
    );

    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(cacheLeafletTiles(request));
        return;
    }

    if (url.pathname.startsWith('/build/assets/')) {
        event.respondWith(cacheAssets(request));
        return;
    }
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

async function cacheLeafletTiles(request) {
    const cache = await caches.open(TILE_CACHE);
    const cached = await cache.match(request);

    if (cached) return cached;

    const response = await fetch(request);
    cache.put(request, response.clone());

    const keys = await cache.keys();
    if (keys.length > MAX_TILES) {
        cache.delete(keys[0]);
    }

    return response;
}

async function cacheAssets(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) return cached;

    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
}
