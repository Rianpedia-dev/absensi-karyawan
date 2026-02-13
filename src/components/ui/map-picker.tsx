'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapPickerProps {
    latitude: number;
    longitude: number;
    radius: number;
    onLocationSelect: (lat: number, lng: number) => void;
    enabled?: boolean;
}

function LocationMarker({ position, onLocationSelect }: { position: [number, number], onLocationSelect: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} icon={customIcon} />
    );
}

// Component to recenter map when props change
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function MapPicker({ latitude, longitude, radius, onLocationSelect, enabled = true }: MapPickerProps) {
    // Default to Jakarta if coords are invalid/zero
    const center: [number, number] = useMemo(() => {
        if (!latitude || !longitude || (latitude === 0 && longitude === 0)) {
            return [-6.200000, 106.816666];
        }
        return [latitude, longitude];
    }, [latitude, longitude]);

    if (!enabled) {
        return (
            <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                <p>Peta dinonaktifkan</p>
            </div>
        );
    }

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0">
            <MapContainer
                center={center}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={center} onLocationSelect={onLocationSelect} />
                <Circle
                    center={center}
                    radius={radius}
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                />
                <ChangeView center={center} />
            </MapContainer>
        </div>
    );
}
