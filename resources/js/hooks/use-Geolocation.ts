import { useEffect, useState } from 'react';

interface GeoOptions {
    enableHighAccuracy?: boolean;
    enableIPFallback?: boolean;
    enabled?: boolean;
}

const GEO_CACHE_KEY = 'geo_coords';
const GEO_CACHE_TTL = 20 * 60 * 1000; // 20 minutos

function getCachedCoords() {
    try {
        const raw = sessionStorage.getItem(GEO_CACHE_KEY);
        if (!raw) return null;

        const cached = JSON.parse(raw);

        if (Date.now() - cached.timestamp > GEO_CACHE_TTL) {
            sessionStorage.removeItem(GEO_CACHE_KEY);
            return null;
        }

        return cached;
    } catch {
        return null;
    }
}

function setCachedCoords(lat: number, lng: number) {
    sessionStorage.setItem(
        GEO_CACHE_KEY,
        JSON.stringify({
            lat,
            lng,
            timestamp: Date.now(),
        }),
    );
}

export function useGeolocation(options?: GeoOptions) {
    const enabled = options?.enabled ?? true;

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const cached = getCachedCoords();
        if (cached) {
            setLatitude(cached.lat);
            setLongitude(cached.lng);
            return;
        }

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setLatitude(lat);
                setLongitude(lng);
                setCachedCoords(lat, lng);

                setLoading(false);
            },
            () => {
                setError('Permission denied');
                setLoading(false);
            },
            {
                enableHighAccuracy: options?.enableHighAccuracy ?? false,
            },
        );
    }, [enabled]);

    return {
        latitude,
        longitude,
        loading,
        error,
    };
}
