import { useCallback, useEffect, useRef, useState } from 'react';

export interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
    source: 'navigator' | 'ip' | 'cache' | null;
}

export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    enableIPFallback?: boolean;
    ipApiUrl?: string;
    cacheMinutes?: number;
}

interface CachedLocation {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    timestamp: number;
    expiresAt: number;
    source: 'navigator' | 'ip';
}

// ... (tus interfaces GeolocationState, GeolocationOptions y CachedLocation se mantienen igual)

export function useGeolocation(options: GeolocationOptions = {}) {
    const {
        enableHighAccuracy = true,
        timeout = 10000,
        maximumAge = 0,
        enableIPFallback = true,
        ipApiUrl = 'https://ipapi.co/json/',
        cacheMinutes = 30,
    } = options;

    const cacheKey = 'geolocation_cache';
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
        source: null,
    });

    const isMountedRef = useRef(true);

    const getLocationByIP = useCallback(async () => {
        try {
            const response = await fetch(ipApiUrl);
            if (!response.ok)
                throw new Error('Error al obtener ubicación por IP');

            const data = await response.json();

            if (isMountedRef.current && data.latitude && data.longitude) {
                const location: GeolocationState = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: null,
                    error: null,
                    loading: false,
                    source: 'ip',
                };

                setState(location);

                const cacheData: CachedLocation = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: null,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + cacheMinutes * 60 * 1000,
                    source: 'ip',
                };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            }
        } catch (error) {
            if (isMountedRef.current) {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: 'No se pudo obtener la ubicación',
                }));
            }
        }
    }, [ipApiUrl, cacheMinutes]);

    const getLocation = useCallback(() => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const data: CachedLocation = JSON.parse(cached);
                if (Date.now() < data.expiresAt) {
                    setState({
                        latitude: data.latitude,
                        longitude: data.longitude,
                        accuracy: data.accuracy,
                        error: null,
                        loading: false,
                        source: 'cache',
                    });
                    return;
                }
                localStorage.removeItem(cacheKey);
            }
        } catch (e) {
            localStorage.removeItem(cacheKey);
        }

        if (!navigator.geolocation) {
            if (enableIPFallback) getLocationByIP();
            else
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: 'No soportado',
                }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!isMountedRef.current) return;

                const location: GeolocationState = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    error: null,
                    loading: false,
                    source: 'navigator',
                };

                setState(location);

                const cacheData: CachedLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + cacheMinutes * 60 * 1000,
                    source: 'navigator',
                };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            },
            (error) => {
                if (enableIPFallback) getLocationByIP();
                else {
                    setState((prev) => ({
                        ...prev,
                        loading: false,
                        error: error.message,
                    }));
                }
            },
            { enableHighAccuracy, timeout, maximumAge },
        );
    }, [
        enableHighAccuracy,
        timeout,
        maximumAge,
        enableIPFallback,
        getLocationByIP,
        cacheMinutes,
    ]);

    useEffect(() => {
        isMountedRef.current = true;
        getLocation();

        return () => {
            isMountedRef.current = false;
        };
    }, [getLocation]);

    const refresh = () => {
        localStorage.removeItem(cacheKey);
        getLocation();
    };

    const clearCache = () => localStorage.removeItem(cacheKey);

    return { ...state, refresh, clearCache };
}
