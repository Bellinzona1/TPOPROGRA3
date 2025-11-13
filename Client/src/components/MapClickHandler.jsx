import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const tempIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #f59e0b; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">📍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function MapClickHandler({ 
  modoSeleccion, 
  onPuntoSeleccionado, 
  puntoTemporal 
}) {
  useMapEvents({
    click(e) {
      if (modoSeleccion) {
        onPuntoSeleccionado({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    },
  });

  return puntoTemporal ? (
    <Marker position={[puntoTemporal.lat, puntoTemporal.lng]} icon={tempIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-semibold">Punto seleccionado</p>
          <p className="text-xs text-gray-600">
            Lat: {puntoTemporal.lat.toFixed(4)}<br/>
            Lng: {puntoTemporal.lng.toFixed(4)}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}
