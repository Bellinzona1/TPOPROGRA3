import { useEffect, useRef, useState } from 'react';
import { useMap, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Iconos personalizados para inicio y fin
const createRouteIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-route-marker',
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
      <span style="transform: rotate(45deg); font-size: 18px; font-weight: bold; color: white;">${label}</span>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const startIcon = createRouteIcon('#10b981', '🚀');
const endIcon = createRouteIcon('#ef4444', '🎯');

export default function RoutingControl({ origen, destino, onRouteFound }) {
  const map = useMap();
  const routingControlRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    if (!map || !origen || !destino) return;

    // Limpiar control anterior si existe
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {
        console.log('Error limpiando control anterior:', e);
      }
      routingControlRef.current = null;
    }

    // Crear control de routing (oculto)
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origen.lat, origen.lng),
        L.latLng(destino.lat, destino.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false,
      lineOptions: {
        styles: [
          { color: 'transparent', opacity: 0, weight: 0 }
        ]
      },
      createMarker: function() { return null; }, // Los marcadores los creamos nosotros
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        language: 'es',
        profile: 'driving'
      }),
      formatter: new L.Routing.Formatter({
        language: 'es',
        units: 'metric',
        distanceTemplate: '{value} {unit}'
      })
    }).addTo(map);

    routingControlRef.current = routingControl;

    // Escuchar cuando se encuentra una ruta
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      const coordinates = routes[0].coordinates;
      
      // Guardar coordenadas en el estado para renderizar con Polyline de React
      setRouteCoordinates(coordinates.map(coord => [coord.lat, coord.lng]));
      
      // Extraer las instrucciones paso a paso
      const instructions = routes[0].instructions.map(instruction => ({
        text: instruction.text,
        distance: instruction.distance,
        time: instruction.time,
        direction: instruction.direction,
        type: instruction.type
      }));

      if (onRouteFound) {
        onRouteFound({
          totalDistance: summary.totalDistance,
          totalTime: summary.totalTime,
          instructions: instructions
        });
      }
    });

    // Cleanup solo del control, NO de las coordenadas
    return () => {
      if (routingControlRef.current && map) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          console.log('Error en cleanup:', e);
        }
        routingControlRef.current = null;
      }
    };
  }, [map, origen, destino, onRouteFound]);

  // Renderizar la polyline y los marcadores con React
  return routeCoordinates.length > 0 ? (
    <>
      {/* Sombra/borde de la ruta */}
      <Polyline
        positions={routeCoordinates}
        pathOptions={{
          color: '#1e3a8a',
          weight: 8,
          opacity: 0.4,
          lineJoin: 'round',
          lineCap: 'round'
        }}
      />
      {/* Línea principal de la ruta */}
      <Polyline
        positions={routeCoordinates}
        pathOptions={{
          color: '#3b82f6',
          weight: 6,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round'
        }}
      />
      {/* Marcador de inicio */}
      <Marker position={[origen.lat, origen.lng]} icon={startIcon} zIndexOffset={2000}>
        <Popup>
          <div className="text-center">
            <h3 className="font-bold text-green-600">🚀 INICIO</h3>
            <p className="text-sm text-gray-600">
              {origen.nombre || `Lat: ${origen.lat.toFixed(6)}, Lng: ${origen.lng.toFixed(6)}`}
            </p>
          </div>
        </Popup>
      </Marker>
      {/* Marcador de fin */}
      <Marker position={[destino.lat, destino.lng]} icon={endIcon} zIndexOffset={2000}>
        <Popup>
          <div className="text-center">
            <h3 className="font-bold text-red-600">🎯 DESTINO</h3>
            <p className="text-sm text-gray-600">
              {destino.nombre || `Lat: ${destino.lat.toFixed(6)}, Lng: ${destino.lng.toFixed(6)}`}
            </p>
          </div>
        </Popup>
      </Marker>
    </>
  ) : null;
}
