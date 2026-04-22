import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TIRANA_CENTER = [41.3275, 19.8197];

const CATEGORY_COLORS = {
  Coffee:     '#C8583A',
  Restaurant: '#3B6D11',
  Bar:        '#185FA5',
  Nightlife:  '#993556',
  Shopping:   '#8B7355',
  'Day Trip': '#2D5A3D',
};

function FlyToSpot({ spot }) {
  const map = useMap();
  useEffect(() => {
    if (spot) {
      map.flyTo([spot.latitude, spot.longitude], 16, { duration: 0.8 });
    }
  }, [spot, map]);
  return null;
}

export default function MapView({ spots, activeFilter, selectedSpot, onSelectSpot }) {
  const visible = spots.filter(
    (s) => !activeFilter || s.category === activeFilter
  );

  return (
    <MapContainer
      center={TIRANA_CENTER}
      zoom={14}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {selectedSpot && <FlyToSpot spot={selectedSpot} />}

      {visible.map((spot) => {
        const isSelected = selectedSpot?.id === spot.id;
        const color = CATEGORY_COLORS[spot.category] ?? '#888';
        const locked = spot.locked;

        return (
          <CircleMarker
            key={spot.id}
            center={[spot.latitude, spot.longitude]}
            radius={isSelected ? 12 : 9}
            pathOptions={{
              fillColor: locked ? '#9CA3AF' : color,
              fillOpacity: locked ? 0.55 : 0.92,
              color: locked ? '#6B7280' : '#fff',
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{ click: () => onSelectSpot(spot) }}
          >
            {!locked && (
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <span className="text-xs font-medium">{spot.name}</span>
              </Tooltip>
            )}
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
