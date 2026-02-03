import { useEffect, useState } from 'react';

interface GeoOptions {
    enableHighAccuracy?: boolean;
    enableIPFallback?: boolean;
    enabled?: boolean;
}

export function useGeolocation(options?: GeoOptions) {
    const enabled = options?.enabled ?? true;

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
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
