import 'leaflet/dist/leaflet.css';
import { ReactNode } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

interface MapProps {
    center: [number, number];
    zoom?: number;
    children?: ReactNode;
    scrollWheelZoom?: boolean;
    className?: string;
}

export function Map({
    center,
    zoom = 16,
    children,
    scrollWheelZoom = false,
    className,
}: MapProps) {
    return (
        <div className={className ?? 'h-full w-full'}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={scrollWheelZoom}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {children}
            </MapContainer>
        </div>
    );
}
