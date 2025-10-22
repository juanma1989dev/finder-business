import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

/**
 * AddressAutocompleteGeoapify (mejor dedup / combine locality+municipality)
 */
export default function AddressAutocompleteGeoapify({ onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [lat, setLat] = useState(17.381111);
    const [lon, setLon] = useState(-97.3575);
    const [fullAddressInfo, setFullAddressInfo] = useState(null);

    const selectedRef = useRef(null);
    const apiKey = '23fe0275826e4a4a9455440ff39a4438'; // <-- reemplaza

    /* ---------------- helpers ---------------- */
    const normalize = (s = '') =>
        s
            .toString()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^\p{L}\p{N}\s]/gu, '')
            .trim()
            .toLowerCase();

    const isSimilar = (a = '', b = '') => {
        if (!a || !b) return false;
        const na = normalize(a);
        const nb = normalize(b);
        return na === nb || na.includes(nb) || nb.includes(na);
    };

    // elimina tokens que son substring de otro token (se queda con el más largo)
    const pruneSubstrings = (arr) => {
        const keep = [];
        for (const x of arr) {
            const nx = normalize(x);
            // si ya existe uno que contiene a x, skip
            if (keep.some((k) => normalize(k).includes(nx))) continue;
            // eliminar los existentes que son substring de x
            for (let i = keep.length - 1; i >= 0; i--) {
                if (nx.includes(normalize(keep[i]))) keep.splice(i, 1);
            }
            keep.push(x);
        }
        return keep;
    };

    /* normalize place from Geoapify/Nominatim */
    const normalizePlace = (raw) => {
        const props = raw.properties || raw;
        const geom = raw.geometry || raw;
        const latVal =
            props.lat ||
            (geom?.coordinates && geom.coordinates[1]) ||
            props.latitude ||
            null;
        const lonVal =
            props.lon ||
            (geom?.coordinates && geom.coordinates[0]) ||
            props.longitude ||
            null;

        const addr1 =
            props.address_line1 || props.formatted || props.name || '';
        const addr2 = props.address_line2 || '';

        return {
            id:
                props.place_id ||
                props.osm_id ||
                props.id ||
                addr1 + (latVal ? `_${latVal}_${lonVal}` : ''),
            rawProps: props,
            lat: latVal ? parseFloat(latVal) : null,
            lon: lonVal ? parseFloat(lonVal) : null,
            address_line1: addr1,
            address_line2: addr2,
            formatted: props.formatted || addr1,
        };
    };

    /* ---------- autocomplete robusto ---------- */
    useEffect(() => {
        if (!query || query === selectedRef.current || query.length < 3) {
            setResults([]);
            return;
        }
        const abort = new AbortController();
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const proximity =
                    lat && lon ? `&bias=proximity:${lat},${lon}` : '';
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    query,
                )}&apiKey=${apiKey}&lang=es&limit=8&filter=countrycode:mx${proximity}`;

                const res = await fetch(url, { signal: abort.signal });
                const data = await res.json();
                const raw = data.features || data.results || [];
                const normalized = (raw || []).map(normalizePlace);

                // formatea label limpio para cada suggestion usando buildPlaceLabel (más abajo)
                const withLabel = normalized.map((p) => ({
                    ...p,
                    label: buildPlaceLabelFromProps(p.rawProps),
                }));

                setResults(withLabel);
            } catch (err) {
                if (err.name !== 'AbortError')
                    console.error('autocomplete error', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            clearTimeout(t);
            abort.abort();
        };
    }, [query]);

    /* ---------- reverse geocode (Geoapify) ---------- */
    const reverseGeoapify = async (latVal, lonVal) => {
        try {
            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latVal}&lon=${lonVal}&apiKey=${apiKey}&lang=es`;
            const r = await fetch(url);
            const d = await r.json();
            const feat = d.features?.[0];
            if (!feat) return null;
            const p = feat.properties || {};
            return {
                locality:
                    p.city ||
                    p.town ||
                    p.village ||
                    p.hamlet ||
                    p.locality ||
                    '',
                municipality:
                    p.county || p.municipality || p.state_district || '',
                suburb: p.suburb || p.neighbourhood || p.district || '',
                road: p.street || p.name || p.address_line1 || '',
                house_number: p.housenumber || '',
                state: p.state || '',
                postcode: p.postcode || '',
                country: p.country || '',
                formatted: p.formatted || '',
                raw: p,
            };
        } catch (e) {
            console.error('geoapify reverse error', e);
            return null;
        }
    };

    const reverseNominatim = async (latVal, lonVal) => {
        try {
            const params = new URLSearchParams({
                format: 'json',
                lat: String(latVal),
                lon: String(lonVal),
                addressdetails: '1',
                zoom: '18',
                'accept-language': 'es',
            });
            const r = await fetch(
                `https://nominatim.openstreetmap.org/reverse?${params}`,
            );
            const d = await r.json();
            const addr = d.address || {};
            return {
                locality:
                    addr.city || addr.town || addr.village || addr.hamlet || '',
                municipality: addr.county || '',
                suburb: addr.suburb || addr.neighbourhood || addr.quarter || '',
                road:
                    addr.road ||
                    addr.pedestrian ||
                    addr.highway ||
                    addr.cycleway ||
                    addr.footway ||
                    '',
                house_number: addr.house_number || '',
                state: addr.state || '',
                postcode: addr.postcode || '',
                country: addr.country || '',
                display_name: d.display_name || '',
                raw: addr,
            };
        } catch (e) {
            console.error('nominatim reverse error', e);
            return null;
        }
    };

    /* ---------- combine locality + municipality rechazando duplicados ---------- */
    const combineLocalityMunicipality = (locality, municipality) => {
        if (!locality && !municipality) return '';
        if (!locality) return municipality;
        if (!municipality) return locality;
        const nLoc = normalize(locality);
        const nMun = normalize(municipality);
        // si uno contiene al otro -> retorna el que aporta más info (el más largo)
        if (nMun.includes(nLoc)) return municipality;
        if (nLoc.includes(nMun)) return locality;
        // si son distintos, los combinamos en el orden locality + municipality (ej: "La Unión Magdalena Yodocono")
        return `${locality} ${municipality}`;
    };

    /* ---------- construir string final (sin inventar ni duplicar) ---------- */
    const buildAddressString = (info) => {
        if (!info) return 'Ubicación sin dirección';
        const parts = [];

        // calle + número solo si existe
        if (info.road) {
            const c = info.house_number
                ? `${info.road} ${info.house_number}`
                : info.road;
            parts.push(c);
        }

        // colonia/suburb
        if (info.suburb) parts.push(info.suburb);

        // localidad + municipio combinados
        const locmun = combineLocalityMunicipality(
            info.locality,
            info.municipality,
        );
        if (locmun) parts.push(locmun);

        // estado
        if (info.state) parts.push(info.state);

        // cp
        if (info.postcode) parts.push(`CP ${info.postcode}`);

        // quitar duplicados y substrings
        const pruned = pruneSubstrings(parts);

        if (!pruned.length) {
            return (
                info.formatted || info.display_name || 'Ubicación sin dirección'
            );
        }
        return pruned.join(', ');
    };

    /* ---------- construir etiqueta limpia para las suggestions (usando rawProps) ---------- */
    const buildPlaceLabelFromProps = (p = {}) => {
        // p viene de Geoapify o Nominatim (prop naming variable)
        const info = {
            road: p.street || p.name || p.address_line1 || '',
            house_number: p.housenumber || p.address_line2 || '',
            suburb: p.suburb || p.neighbourhood || p.district || '',
            locality:
                p.city || p.town || p.village || p.hamlet || p.locality || '',
            municipality: p.county || p.municipality || '',
            state: p.state || '',
            postcode: p.postcode || '',
            formatted: p.formatted || p.display_name || '',
        };
        return buildAddressString(info);
    };

    /* ---------- getDetailedAddress con fallback ---------- */
    const getDetailedAddress = async (latVal, lonVal) => {
        const g = await reverseGeoapify(latVal, lonVal);
        const geoPoor =
            !g ||
            ((!g.road || g.road.trim() === '') &&
                (!g.suburb || g.suburb.trim() === '') &&
                (!g.locality || g.locality.trim() === ''));
        const formattedText = (g?.formatted || '').toLowerCase();
        const looksGeneric = /sin referencia|otro/i.test(formattedText);

        if (geoPoor || looksGeneric) {
            const n = await reverseNominatim(latVal, lonVal);
            return n || g;
        }
        return g;
    };

    /* ---------- handlers ---------- */
    const handleSelect = async (place) => {
        const newLat = place.lat;
        const newLon = place.lon;
        if (newLat == null || newLon == null) return;

        setLat(newLat);
        setLon(newLon);
        setResults([]);
        selectedRef.current = null;

        const detailed = await getDetailedAddress(newLat, newLon);
        setFullAddressInfo(detailed);

        const formatted = buildAddressString(detailed);
        setQuery(formatted);
        selectedRef.current = formatted;

        if (onSelect)
            onSelect({
                lat: newLat,
                lon: newLon,
                address: formatted,
                detailedInfo: detailed,
            });
    };

    const handleMapDrag = async (newLat, newLon) => {
        setLat(newLat);
        setLon(newLon);

        const detailed = await getDetailedAddress(newLat, newLon);
        setFullAddressInfo(detailed);

        const formatted = buildAddressString(detailed);
        setQuery(formatted);
        selectedRef.current = formatted;

        if (onSelect)
            onSelect({
                lat: newLat,
                lon: newLon,
                address: formatted,
                detailedInfo: detailed,
            });
    };

    return (
        <div className="space-y-4" style={{ overflow: 'visible' }}>
            <div className="relative" style={{ overflow: 'visible' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        selectedRef.current = null;
                    }}
                    placeholder="Buscar dirección..."
                    className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {/* Buscando... (z-index super alto + sin pointer events) */}
                {loading && (
                    <div
                        className="absolute top-full left-0 w-full border bg-white p-2 text-sm shadow-md"
                        style={{
                            zIndex: 2147483647,
                            position: 'absolute',
                            marginTop: '6px',
                            pointerEvents: 'none',
                        }}
                    >
                        Buscando...
                    </div>
                )}

                {/* Suggestions */}
                {results.length > 0 && (
                    <ul
                        className="absolute top-full left-0 max-h-64 w-full overflow-y-auto rounded-md border bg-white shadow-lg"
                        style={{
                            zIndex: 2147483647,
                            position: 'absolute',
                            marginTop: '6px',
                        }}
                    >
                        {results.map((r) => (
                            <li
                                key={r.id}
                                className="cursor-pointer border-b p-3 transition-colors last:border-b-0 hover:bg-blue-50"
                                onClick={() => handleSelect(r)}
                            >
                                <div className="text-sm font-medium">
                                    {r.label}
                                </div>
                                <div className="mt-1 text-xs text-gray-600">
                                    {r.formatted}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Dirección final */}
            {fullAddressInfo && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                    <div className="mb-1 font-semibold text-gray-700">
                        Dirección completa:
                    </div>
                    <div className="text-gray-800">
                        {buildAddressString(fullAddressInfo)}
                    </div>
                    {fullAddressInfo.postcode && (
                        <div className="text-gray-600">
                            CP: {fullAddressInfo.postcode}
                        </div>
                    )}
                </div>
            )}

            {/* Mapa */}
            {lat && lon && (
                <MapContainer
                    center={[lat, lon]}
                    zoom={18}
                    style={{ height: '350px', width: '100%' }}
                    className="rounded-lg border shadow-sm"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                        draggable
                        position={[lat, lon]}
                        eventHandlers={{
                            dragend: async (e) => {
                                const marker = e.target;
                                const pos = marker.getLatLng();
                                const newLat = parseFloat(pos.lat.toFixed(6));
                                const newLon = parseFloat(pos.lng.toFixed(6));
                                await handleMapDrag(newLat, newLon);
                            },
                        }}
                        icon={new L.Icon.Default()}
                    />
                </MapContainer>
            )}
        </div>
    );
}
