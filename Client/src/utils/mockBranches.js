export const mockBranches = [
  { id: 'palermo', nombre: 'Sucursal Palermo', lat: -34.5713, lng: -58.4233 },
  { id: 'belgrano', nombre: 'Sucursal Belgrano', lat: -34.5620, lng: -58.4584 },
  { id: 'recoleta', nombre: 'Sucursal Recoleta', lat: -34.5889, lng: -58.3960 },
  { id: 'caballito', nombre: 'Sucursal Caballito', lat: -34.6187, lng: -58.4438 },
  { id: 'microcentro', nombre: 'Sucursal Microcentro', lat: -34.6037, lng: -58.3816 },
];

export function haversineDistance(a, b) {
  // a and b: { lat, lng }
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aHarv = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));
  return R * c; // distance in km
}
