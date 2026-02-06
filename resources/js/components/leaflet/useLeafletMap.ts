import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface UseLeafletMapOptions {
    follow?: [number, number];
    zoom?: number;
    animate?: boolean;
    duration?: number;
    enabled?: boolean;
}

export function useLeafletMap({
    follow,
    zoom = 16,
    animate = true,
    duration = 0.6,
    enabled = true,
}: UseLeafletMapOptions = {}) {
    const map = useMap();

    useEffect(() => {
        if (!enabled || !follow) return;

        map.flyTo(follow, zoom, {
            animate,
            duration,
        });
    }, [follow, zoom, animate, duration, enabled, map]);

    return {
        map,
        flyTo: (position: [number, number], customZoom = zoom) => {
            map.flyTo(position, customZoom, {
                animate,
                duration,
            });
        },

        setView: (position: [number, number], customZoom = zoom) => {
            map.setView(position, customZoom);
        },
    };
}
