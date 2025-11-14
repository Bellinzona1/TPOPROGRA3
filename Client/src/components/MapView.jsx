import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingControl from './RoutingControl';
import MapClickHandler from './MapClickHandler';
import speechManager from '../utils/speechSynthesis';

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
  destinoManual,
  rutaReal,
  vozActiva
}) {
  const [bounds, setBounds] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [previousRouteLength, setPreviousRouteLength] = useState(0);
  
  // Leer instrucción actual cuando cambia el paso o se activa la voz
  useEffect(() => {
    if (vozActiva && rutaReal && rutaReal.instructions && rutaReal.instructions[currentStepIndex]) {
      const instruction = rutaReal.instructions[currentStepIndex];
      let text = instruction.text;
      
      // Agregar distancia si es significativa
      if (instruction.distance > 50) {
        const distanceText = instruction.distance < 1000
          ? `en ${Math.round(instruction.distance)} metros`
          : `en ${(instruction.distance / 1000).toFixed(1)} kilómetros`;
        text = `${text}, ${distanceText}`;
      }
      
      speechManager.speak(text);
    }
  }, [currentStepIndex, vozActiva]);
  
  // Reiniciar el índice solo cuando cambia el número de instrucciones (nueva ruta)
  useEffect(() => {
    const currentLength = rutaReal?.instructions?.length || 0;
    if (currentLength > 0 && currentLength !== previousRouteLength) {
      setCurrentStepIndex(0);
      setPreviousRouteLength(currentLength);
    }
  }, [rutaReal?.instructions?.length]);
  
  // Debug - para ver si llegan los datos
  useEffect(() => {
    console.log('MapView - mostrarRutaReal:', mostrarRutaReal);
    console.log('MapView - rutaReal:', rutaReal);
    if (rutaReal && rutaReal.instructions) {
      console.log('MapView - Instrucciones:', rutaReal.instructions.length);
    }
  }, [mostrarRutaReal, rutaReal]);
  
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
    <div className="relative h-full w-full">
      {/* Panel de Instrucciones Flotante - Estilo Google Maps */}
      {mostrarRutaReal && rutaReal && rutaReal.instructions && rutaReal.instructions.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] w-96 max-h-[80vh] overflow-hidden">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header con Resumen */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  🧭 Navegación Activa
                </h3>
                <button 
                  onClick={() => setCurrentStepIndex(0)}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
                >
                  Reiniciar
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="opacity-90">📏</span>
                  <span className="font-semibold">{(rutaReal.totalDistance / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="opacity-90">⏱️</span>
                  <span className="font-semibold">{Math.round(rutaReal.totalTime / 60)} min</span>
                </div>
              </div>
            </div>

            {/* Instrucción Actual Grande */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-b-2 border-green-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  {currentStepIndex === 0 && '🚀'}
                  {currentStepIndex > 0 && currentStepIndex < rutaReal.instructions.length - 1 && '➡️'}
                  {currentStepIndex === rutaReal.instructions.length - 1 && '🎯'}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    Paso {currentStepIndex + 1} de {rutaReal.instructions.length}
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-2">
                    {rutaReal.instructions[currentStepIndex].text}
                  </div>
                  {rutaReal.instructions[currentStepIndex].distance > 0 && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold text-green-600">
                        {rutaReal.instructions[currentStepIndex].distance < 1000
                          ? `${Math.round(rutaReal.instructions[currentStepIndex].distance)} m`
                          : `${(rutaReal.instructions[currentStepIndex].distance / 1000).toFixed(1)} km`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Botones de Navegación */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                  className="flex-1 py-2 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setCurrentStepIndex(Math.min(rutaReal.instructions.length - 1, currentStepIndex + 1))}
                  disabled={currentStepIndex === rutaReal.instructions.length - 1}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition"
                >
                  Siguiente →
                </button>
              </div>
            </div>

            {/* Lista de Todas las Instrucciones */}
            <div className="max-h-96 overflow-y-auto">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Todas las Instrucciones</h4>
              </div>
              {rutaReal.instructions.map((instruction, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-blue-50 ${
                    idx === currentStepIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:border-l-4 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                      idx === currentStepIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx === 0 && '🚀'}
                      {idx > 0 && idx < rutaReal.instructions.length - 1 && (idx + 1)}
                      {idx === rutaReal.instructions.length - 1 && '🎯'}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        idx === currentStepIndex ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {instruction.text}
                      </div>
                      {instruction.distance > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {instruction.distance < 1000
                            ? `${Math.round(instruction.distance)} metros`
                            : `${(instruction.distance / 1000).toFixed(1)} km`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}