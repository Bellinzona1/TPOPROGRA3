import { MapPin, Navigation, Sparkles, GitBranch, Network, Trees, Route, AlertCircle, Zap, TrendingUp, Volume2, VolumeX } from 'lucide-react';
import AgendifyPrimaryButton from './AgendifyPrimaryButton';

export default function Sidebar({
  ciudades = [],
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
  modoSeleccion,
  onSeleccionManualOrigen,
  onSeleccionManualDestino,
  origenManual,
  destinoManual,
  vozActiva,
  onVozActivaChange,
  rutaReal,
}) {
  return (
    <aside className="w-[420px] h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 shadow-2xl overflow-y-auto custom-scrollbar">
      <div className="min-h-full pb-4">
        {/* Header con Logo - Glassmorphism Effect */}
        <div className="relative m-4 overflow-hidden rounded-3xl shadow-2xl group animate-fade-in-up">
          {/* Fondo con gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1FC16B] via-[#1a9d5f] to-[#246BFF] opacity-90 animate-gradient"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative p-6 text-white">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative animate-float">
                <img src="/icon.png" alt="Agendify" className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md p-2 shadow-lg ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight drop-shadow-lg">Agendify Routes</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <p className="text-sm font-medium opacity-95">Planificador Inteligente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de Bienvenida - Modern Card */}
        <div className="mx-4 mb-4 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-1">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-[#1FC16B] to-[#16a861] rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-2">
                ¡Bienvenido!
                <TrendingUp className="w-3.5 h-3.5 text-[#1FC16B] animate-pulse" />
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Calcula <span className="font-semibold text-[#246BFF]">rutas óptimas</span> entre sucursales usando algoritmos avanzados de grafos. 
                Explora <span className="font-semibold text-[#1FC16B]">BFS, DFS, Dijkstra</span> y más.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* Selección de Origen/Destino - Premium Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">Ubicaciones</h2>
            </div>

            <div className="space-y-4">
              {/* Origen */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Punto de origen
              </label>
              {origen === 'manual' && origenManual ? (
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 border-2 border-[#1FC16B] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl text-sm shadow-sm">
                    <div className="font-bold text-[#1FC16B] text-xs flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Punto Manual
                    </div>
                    <div className="text-xs text-gray-600 font-mono mt-1">
                      {origenManual.lat.toFixed(4)}, {origenManual.lng.toFixed(4)}
                    </div>
                  </div>
                  <button
                    onClick={() => setOrigen('')}
                    className="px-3 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-xs font-medium"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={origen === 'manual' ? '' : origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1FC16B] focus:ring-2 focus:ring-[#1FC16B]/20 text-sm font-medium bg-white shadow-sm transition-all"
                  >
                    <option value="">Seleccione origen...</option>
                    {ciudades.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <button
                    onClick={onSeleccionManualOrigen}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-sm ${
                      modoSeleccion === 'origen'
                        ? 'bg-gradient-to-br from-[#1FC16B] to-[#16a861] text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow'
                    }`}
                    title="Seleccionar en el mapa"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              )}
              {modoSeleccion === 'origen' && (
                <p className="text-xs text-[#1FC16B] mt-2 animate-pulse flex items-center gap-1.5 font-medium bg-green-50 px-3 py-2 rounded-lg">
                  <Navigation className="w-3.5 h-3.5" />
                  Haz clic en el mapa para seleccionar
                </p>
              )}
            </div>

            {/* Destino */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Punto de destino
              </label>
              {destino === 'manual' && destinoManual ? (
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 border-2 border-[#246BFF] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-sm shadow-sm">
                    <div className="font-bold text-[#246BFF] text-xs flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Punto Manual
                    </div>
                    <div className="text-xs text-gray-600 font-mono mt-1">
                      {destinoManual.lat.toFixed(4)}, {destinoManual.lng.toFixed(4)}
                    </div>
                  </div>
                  <button
                    onClick={() => setDestino('')}
                    className="px-3 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-xs font-medium"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={destino === 'manual' ? '' : destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#246BFF] focus:ring-2 focus:ring-[#246BFF]/20 text-sm font-medium bg-white shadow-sm transition-all"
                  >
                    <option value="">Seleccione destino...</option>
                    {ciudades.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <button
                    onClick={onSeleccionManualDestino}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-sm ${
                      modoSeleccion === 'destino'
                        ? 'bg-gradient-to-br from-[#246BFF] to-[#1a55d8] text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow'
                    }`}
                    title="Seleccionar en el mapa"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              )}
              {modoSeleccion === 'destino' && (
                <p className="text-xs text-[#246BFF] mt-2 animate-pulse flex items-center gap-1.5 font-medium bg-blue-50 px-3 py-2 rounded-lg">
                  <Navigation className="w-3.5 h-3.5" />
                  Haz clic en el mapa para seleccionar
                </p>
              )}
            </div>

            {/* Botón Calcular Ruta - Premium */}
            <button
              onClick={onCalcularRuta}
              disabled={!origen || !destino || loading}
              className="w-full py-4 rounded-2xl text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-sm relative overflow-hidden group disabled:hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1FC16B 0%, #246BFF 100%)' }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <Navigation className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                Calcular Ruta Óptima (Dijkstra)
              </span>
            </button>
          </div>
        </div>

        {/* Algoritmos adicionales - Premium Grid */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md animate-pulse">
                <Network className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">Algoritmos de Grafos</h2>
            </div>

            {(origen === 'manual' || destino === 'manual') && (
              <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-amber-700 font-medium leading-relaxed">
                  Los algoritmos de grafo requieren ciudades predefinidas.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onBFS}
                disabled={!origen || loading || origen === 'manual'}
                className="group relative flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-pink-500 to-rose-600 text-white py-4 rounded-xl text-xs font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden animate-scale-in stagger-1"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-shimmer transition-opacity"></div>
                <GitBranch className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">BFS</span>
              </button>
              <button
                onClick={onDFS}
                disabled={!origen || loading || origen === 'manual'}
                className="group relative flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-rose-500 to-red-600 text-white py-4 rounded-xl text-xs font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden animate-scale-in stagger-2"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-shimmer transition-opacity"></div>
                <GitBranch className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">DFS</span>
              </button>
              <button
                onClick={onPrim}
                disabled={!origen || loading || origen === 'manual' || destino === 'manual'}
                className="group relative flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white py-4 rounded-xl text-xs font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden animate-scale-in stagger-3"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-shimmer transition-opacity"></div>
                <Trees className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Prim</span>
              </button>
              <button
                onClick={onKruskal}
                disabled={loading || origen === 'manual' || destino === 'manual'}
                className="group relative flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-4 rounded-xl text-xs font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden animate-scale-in stagger-4"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-shimmer transition-opacity"></div>
                <Trees className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Kruskal</span>
              </button>
            </div>
          </div>

        {/* Loading - Modern Spinner */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg text-center animate-fade-in-up">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-transparent" style={{ borderTopColor: '#1FC16B' }}></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1FC16B]/20 to-[#246BFF]/20 blur-md animate-pulse"></div>
            </div>
            <p className="text-gray-700 mt-4 text-sm font-semibold">Calculando ruta...</p>
            <p className="text-gray-500 text-xs mt-1">Procesando algoritmo</p>
          </div>
        )}

        {/* Resultados - Premium Card */}
        {resultado && !loading && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl border-l-4 border-[#1FC16B] hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
            <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-[#1FC16B] to-[#16a861] rounded-lg animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span>
                {resultado.tipo === 'dijkstra' && 'Ruta Óptima'}
                {resultado.tipo === 'agendify' && 'Ruta Calculada'}
                {resultado.tipo === 'bfs' && 'Recorrido BFS'}
                {resultado.tipo === 'dfs' && 'Recorrido DFS'}
                {resultado.tipo === 'prim' && 'Árbol MST (Prim)'}
                {resultado.tipo === 'kruskal' && 'Árbol MST (Kruskal)'}
              </span>
            </h3>

            {resultado.distancia !== undefined && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border-2 border-green-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Distancia Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black bg-gradient-to-r from-[#1FC16B] to-[#16a861] bg-clip-text text-transparent">
                      {resultado.distancia.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-gray-500">km</span>
                  </div>
                </div>
              </div>
            )}

            {resultado.camino && resultado.camino.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Route className="w-3.5 h-3.5" />
                  Recorrido
                </p>
                <ul className="space-y-2">
                  {resultado.camino.map((ciudad, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                      <span className="text-lg flex-shrink-0">
                        {idx === 0 && '🚀'}
                        {idx === resultado.camino.length - 1 && idx !== 0 && '🎯'}
                        {idx !== 0 && idx !== resultado.camino.length - 1 && '→'}
                      </span>
                      <span className="font-bold text-sm text-gray-800">{typeof ciudad === 'string' ? ciudad : ciudad?.nombre || ciudad}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resultado.aristas && resultado.aristas.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mt-4 border border-blue-200 shadow-sm">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Network className="w-3.5 h-3.5" />
                  Aristas del Árbol
                </p>
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {resultado.aristas.map((arista, idx) => (
                    <li key={idx} className="text-xs bg-white/50 rounded-lg p-2 font-medium text-gray-700 hover:bg-white transition-colors">
                      <span className="font-bold text-blue-600">{arista.origen}</span>
                      {' '}↔{' '}
                      <span className="font-bold text-purple-600">{arista.destino}</span>
                      <span className="text-gray-500"> ({arista.peso.toFixed(1)} km)</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Peso Total</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {resultado.pesoTotal.toFixed(1)}
                      </span>
                      <span className="text-sm font-bold text-gray-500">km</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Control de Voz - Premium Toggle */}
        {rutaReal && rutaReal.instructions && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shadow-md transition-all duration-300 ${
                  vozActiva 
                    ? 'bg-gradient-to-br from-[#1FC16B] to-[#16a861] animate-pulse' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  {vozActiva ? (
                    <Volume2 className="w-4 h-4 text-white animate-float" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Guía por Voz
                  </h3>
                  <p className="text-xs text-gray-500">
                    {vozActiva ? 'Activada' : 'Desactivada'}
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch - Modern */}
              <button
                onClick={() => onVozActivaChange(!vozActiva)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner hover:scale-105 ${
                  vozActiva 
                    ? 'bg-gradient-to-r from-[#1FC16B] to-[#16a861]' 
                    : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                    vozActiva ? 'translate-x-7' : 'translate-x-0'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    vozActiva ? 'bg-gradient-to-br from-green-400/20 to-emerald-500/20 animate-pulse' : ''
                  }`}></div>
                </div>
              </button>
            </div>

            {/* Información de ruta real */}
            {rutaReal && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs animate-fade-in-up stagger-1">
                    <span className="text-gray-600 font-medium">Distancia Real:</span>
                    <span className="font-bold text-[#1FC16B]">
                      {(rutaReal.distance / 1000).toFixed(2)} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs animate-fade-in-up stagger-2">
                    <span className="text-gray-600 font-medium">Tiempo Estimado:</span>
                    <span className="font-bold text-[#246BFF]">
                      {Math.round(rutaReal.duration / 60)} min
                    </span>
                  </div>
                  {vozActiva && (
                    <div className="mt-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 animate-scale-in">
                      <p className="text-xs text-green-700 font-medium flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        Instrucciones de navegación activas
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Agendify - Premium Button */}
      <div className="mx-4 mb-3 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#1FC16B] to-[#246BFF] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <AgendifyPrimaryButton
          label="✨ Crear Cuenta Gratis"
          onClick={() => window.open('https://agendify.pro', '_blank')}
        />
      </div>

      {/* Footer - Powered by Agendify */}
      <div className="mx-4 mb-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-md hover:shadow-lg transition-all duration-300 group">
          <Sparkles className="w-4 h-4 text-[#1FC16B] group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-bold bg-gradient-to-r from-[#1FC16B] to-[#246BFF] bg-clip-text text-transparent">
            Gracias Agendify
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#1FC16B] to-[#246BFF] animate-pulse"></div>
        </div>
      </div>
    </div>
  </aside>
  );
}
