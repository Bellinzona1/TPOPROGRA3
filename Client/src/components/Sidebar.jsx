export default function Sidebar({
  ciudades,
  origen,
  setOrigen,
  destino,
  setDestino,
  onCalcularRuta,
  resultado,
  loading,
  onBFS,
  onDFS,
  onPrim,
  onKruskal,
  stats,
  rutaReal,
  mostrarRutaReal,
  setMostrarRutaReal,
  modoSeleccion,
  setModoSeleccion,
  onSeleccionManualOrigen,
  onSeleccionManualDestino,
  origenManual,
  destinoManual,
  vozActiva,
  onVozActivaChange
}) {
  return (
    <div className="w-96 bg-white shadow-2xl overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-1">🗺️ Mini Maps</h1>
        <p className="text-sm opacity-90">Sistema de Rutas con Algoritmos de Grafos</p>
      </div>

      <div className="p-6 flex-1">
        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.ciudades}</div>
              <div className="text-xs text-gray-600 uppercase mt-1">Ciudades</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{stats.rutas}</div>
              <div className="text-xs text-gray-600 uppercase mt-1">Rutas</div>
            </div>
          </div>
        )}

        {/* Selección de Ciudades */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3 tracking-wide">
            📍 Calcular Ruta
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ciudad de Origen</label>
              {origen === 'manual' && origenManual ? (
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2 border border-green-300 bg-green-50 rounded-lg text-sm">
                    <div className="font-medium text-green-700">📍 Punto Manual</div>
                    <div className="text-xs text-gray-600">
                      Lat: {origenManual.lat.toFixed(6)}, Lng: {origenManual.lng.toFixed(6)}
                    </div>
                  </div>
                  <button
                    onClick={() => setOrigen('')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    title="Limpiar selección"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={origen === 'manual' ? '' : origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Seleccione origen...</option>
                    {ciudades.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <button
                    onClick={onSeleccionManualOrigen}
                    className={`px-4 py-2 rounded-lg transition ${
                      modoSeleccion === 'origen'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Seleccionar en el mapa"
                  >
                    📍
                  </button>
                </div>
              )}
              {modoSeleccion === 'origen' && (
                <p className="text-xs text-green-600 mt-1 animate-pulse">
                  👆 Haz clic en el mapa para seleccionar el origen
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Ciudad de Destino</label>
              {destino === 'manual' && destinoManual ? (
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2 border border-red-300 bg-red-50 rounded-lg text-sm">
                    <div className="font-medium text-red-700">📍 Punto Manual</div>
                    <div className="text-xs text-gray-600">
                      Lat: {destinoManual.lat.toFixed(6)}, Lng: {destinoManual.lng.toFixed(6)}
                    </div>
                  </div>
                  <button
                    onClick={() => setDestino('')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    title="Limpiar selección"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={destino === 'manual' ? '' : destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Seleccione destino...</option>
                    {ciudades.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <button
                    onClick={onSeleccionManualDestino}
                    className={`px-4 py-2 rounded-lg transition ${
                      modoSeleccion === 'destino'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Seleccionar en el mapa"
                  >
                    📍
                  </button>
                </div>
              )}
              {modoSeleccion === 'destino' && (
                <p className="text-xs text-red-600 mt-1 animate-pulse">
                  👆 Haz clic en el mapa para seleccionar el destino
                </p>
              )}
            </div>

            <button
              onClick={onCalcularRuta}
              disabled={!origen || !destino || loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🧭 Calcular Ruta Óptima (Dijkstra)
            </button>

            <div className="mt-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarRutaReal}
                  onChange={(e) => setMostrarRutaReal(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  🚗 Mostrar ruta real con direcciones de calles
                </span>
              </label>
            </div>

            <div className="mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vozActiva}
                  onChange={(e) => onVozActivaChange(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  disabled={!mostrarRutaReal}
                />
                <span className={`text-sm ${!mostrarRutaReal ? 'text-gray-400' : 'text-gray-700'}`}>
                  🔊 Activar instrucciones por voz (estilo Google Maps)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Otros Algoritmos */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3 tracking-wide">
            🔬 Otros Algoritmos
          </h2>
          
          {(origen === 'manual' || destino === 'manual') && (
            <p className="text-xs text-amber-600 mb-2 p-2 bg-amber-50 rounded border border-amber-200">
              ℹ️ Los algoritmos de grafo solo funcionan con ciudades predefinidas. Para puntos manuales, usa Dijkstra con ruta real.
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBFS}
              disabled={!origen || loading || origen === 'manual'}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition disabled:opacity-50"
            >
              BFS
            </button>
            <button
              onClick={onDFS}
              disabled={!origen || loading || origen === 'manual'}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition disabled:opacity-50"
            >
              DFS
            </button>
            <button
              onClick={onPrim}
              disabled={!origen || loading || origen === 'manual' || destino === 'manual'}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition disabled:opacity-50"
            >
              Prim (MST)
            </button>
            <button
              onClick={onKruskal}
              disabled={loading || origen === 'manual' || destino === 'manual'}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition disabled:opacity-50"
            >
              Kruskal (MST)
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-gray-600 mt-3">Calculando...</p>
          </div>
        )}

        {/* Resultados */}
        {resultado && !loading && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-indigo-700 mb-3 uppercase">
              {resultado.tipo === 'dijkstra' && '🎯 Ruta Óptima Encontrada'}
              {resultado.tipo === 'bfs' && '🔍 Recorrido BFS'}
              {resultado.tipo === 'dfs' && '🔍 Recorrido DFS'}
              {resultado.tipo === 'prim' && '🌳 Árbol de Expansión Mínima (Prim)'}
              {resultado.tipo === 'kruskal' && '🌳 Árbol de Expansión Mínima (Kruskal)'}
            </h3>

            {resultado.distancia !== undefined && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Distancia Total</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {resultado.distancia.toFixed(1)} km
                  </span>
                </div>
              </div>
            )}

            {resultado.camino && resultado.camino.length > 0 && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500 uppercase mb-2">Recorrido</p>
                <ul className="space-y-1">
                  {resultado.camino.map((ciudad, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center">
                      <span className="mr-2">
                        {idx === 0 && '🚀'}
                        {idx === resultado.camino.length - 1 && idx !== 0 && '🎯'}
                        {idx !== 0 && idx !== resultado.camino.length - 1 && '→'}
                      </span>
                      {typeof ciudad === 'string' ? ciudad : ciudad?.nombre || ciudad}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resultado.aristas && resultado.aristas.length > 0 && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase mb-2">Aristas del Árbol</p>
                <ul className="space-y-1">
                  {resultado.aristas.map((arista, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {arista.origen} ↔ {arista.destino} ({arista.peso.toFixed(1)} km)
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Peso Total</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {resultado.pesoTotal.toFixed(1)} km
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instrucciones de Ruta Real */}
        {rutaReal && mostrarRutaReal && !loading && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-600 p-4 rounded-lg mt-4">
            <h3 className="text-sm font-bold text-green-700 mb-3 uppercase flex items-center">
              <span className="mr-2">🚗</span>
              Direcciones Turn-by-Turn
            </h3>

            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {(rutaReal.totalDistance / 1000).toFixed(1)} km
                  </div>
                  <div className="text-xs text-gray-500">Distancia</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(rutaReal.totalTime / 60)} min
                  </div>
                  <div className="text-xs text-gray-500">Tiempo estimado</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 max-h-96 overflow-y-auto">
              <p className="text-xs text-gray-500 uppercase mb-3">Instrucciones paso a paso</p>
              <ol className="space-y-3">
                {rutaReal.instructions.map((instruction, idx) => {
                  const getIcon = (type) => {
                    if (type === 'WaypointReached') return '🎯';
                    if (type === 'Head') return '🚀';
                    if (type.includes('Right')) return '➡️';
                    if (type.includes('Left')) return '⬅️';
                    if (type.includes('Straight')) return '⬆️';
                    if (type.includes('UTurn')) return '↩️';
                    return '▶️';
                  };

                  return (
                    <li key={idx} className="flex items-start space-x-2 pb-3 border-b border-gray-100 last:border-0">
                      <span className="text-lg flex-shrink-0">{getIcon(instruction.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{instruction.text}</p>
                        {instruction.distance > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {instruction.distance >= 1000 
                              ? `${(instruction.distance / 1000).toFixed(1)} km`
                              : `${Math.round(instruction.distance)} m`}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
