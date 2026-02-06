import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

interface MapProps {
    deliveryLocation: { lat: number; lng: number } | null;
}

/* Icono custom del repartidor */
const deliveryIcon = new L.DivIcon({
    className: '',
    html: `
        <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            background:#7c3aed;
            width:32px;
            height:32px;
            border-radius:9999px;
            box-shadow:0 4px 10px rgba(0,0,0,.3);
            border:2px solid white;
        ">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M12 2L3 21l9-4 9 4-9-19z"/>
            </svg>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

export default function MapDelivery({ deliveryLocation }: MapProps) {
    const center: [number, number] = deliveryLocation
        ? [deliveryLocation.lat, deliveryLocation.lng]
        : [17.4606859, -97.2275336];

    return (
        <MapContainer
            center={center}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {deliveryLocation && (
                <Marker
                    position={[deliveryLocation.lat, deliveryLocation.lng]}
                    icon={deliveryIcon}
                />
            )}
        </MapContainer>
    );
}
