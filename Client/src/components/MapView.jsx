import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingControl from './RoutingControl';
import MapClickHandler from './MapClickHandler';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados con diferentes tamaños
const createCustomIcon = (color, size = 25) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const origenIcon = createCustomIcon('#10b981', 35);
const destinoIcon = createCustomIcon('#ef4444', 35);
const rutaIcon = createCustomIcon('#6366f1', 30);
const normalIcon = createCustomIcon('#94a3b8', 20);

// Componente para ajustar el mapa a las coordenadas
function FitBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

export default function MapView({ 
  ciudades, 
  rutaOptima, 
  origen, 
  destino, 
  todasLasRutas, 
  mostrarRutaReal, 
  onRutaRealEncontrada,
  modoSeleccion,
  onPuntoSeleccionado,
  puntoTemporal,
  origenManual,
  destinoManual
}) {
  const [bounds, setBounds] = useState([]);
  
  useEffect(() => {
    if (ciudades.length > 0) {
      const newBounds = ciudades.map(c => [c.lat, c.lng]);
      setBounds(newBounds);
    }
  }, [ciudades]);

  // Argentina como centro por defecto
  const center = [-34.6037, -64.0];
  const zoom = 5;

  // Obtener objetos completos de ciudad para origen y destino
  const ciudadOrigen = origen === 'manual' ? origenManual : ciudades.find(c => c.id === origen);
  const ciudadDestino = destino === 'manual' ? destinoManual : ciudades.find(c => c.id === destino);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <FitBounds bounds={bounds} />

      {/* Handler para clicks en el mapa */}
      <MapClickHandler
        modoSeleccion={modoSeleccion}
        onPuntoSeleccionado={onPuntoSeleccionado}
        puntoTemporal={puntoTemporal}
      />

      {/* Routing con direcciones reales (OSRM) */}
      {mostrarRutaReal && ciudadOrigen && ciudadDestino && (
        <RoutingControl
          origen={ciudadOrigen}
          destino={ciudadDestino}
          onRouteFound={onRutaRealEncontrada}
        />
      )}

      {/* Dibujar todas las rutas en gris claro */}
      {todasLasRutas && todasLasRutas.map((ruta, idx) => (
        <Polyline
          key={`ruta-${idx}`}
          positions={ruta.coords}
          color="#cbd5e1"
          weight={2}
          opacity={0.4}
        />
      ))}

      {/* Dibujar ruta óptima con estilo destacado */}
      {rutaOptima && rutaOptima.length > 1 && (
        <>
          {/* Línea de fondo más gruesa para efecto de borde */}
          <Polyline
            positions={rutaOptima.map(c => [c.lat, c.lng])}
            color="#1e1b4b"
            weight={8}
            opacity={0.3}
          />
          {/* Línea principal de la ruta */}
          <Polyline
            positions={rutaOptima.map(c => [c.lat, c.lng])}
            color="#6366f1"
            weight={5}
            opacity={0.9}
            dashArray="10, 5"
            className="animate-pulse"
          />
          {/* Flechas direccionales para cada segmento */}
          {rutaOptima.slice(0, -1).map((ciudad, idx) => {
            const siguiente = rutaOptima[idx + 1];
            return (
              <Polyline
                key={`arrow-${idx}`}
                positions={[
                  [ciudad.lat, ciudad.lng],
                  [siguiente.lat, siguiente.lng]
                ]}
                color="#8b5cf6"
                weight={3}
                opacity={0.7}
              />
            );
          })}
        </>
      )}

      {/* Marcadores de ciudades */}
      {ciudades.map((ciudad) => {
        let icon = normalIcon;
        let zIndex = 1;
        
        if (ciudad.id === origen) {
          icon = origenIcon;
          zIndex = 1000;
        } else if (ciudad.id === destino) {
          icon = destinoIcon;
          zIndex = 1000;
        } else if (rutaOptima && rutaOptima.some(c => c.id === ciudad.id)) {
          icon = rutaIcon;
          zIndex = 500;
        }

        return (
          <Marker
            key={ciudad.id}
            position={[ciudad.lat, ciudad.lng]}
            icon={icon}
            zIndexOffset={zIndex}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{ciudad.nombre}</h3>
                <p className="text-sm text-gray-600">
                  Lat: {ciudad.lat.toFixed(4)}, Lng: {ciudad.lng.toFixed(4)}
                </p>
                {ciudad.id === origen && (
                  <p className="text-xs text-green-600 font-bold mt-1">🚀 ORIGEN</p>
                )}
                {ciudad.id === destino && (
                  <p className="text-xs text-red-600 font-bold mt-1">🎯 DESTINO</p>
                )}
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -15]} opacity={0.9}>
              <span className="font-semibold">{ciudad.nombre}</span>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
