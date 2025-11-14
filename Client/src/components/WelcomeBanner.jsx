import { useState, useEffect } from 'react';
import { X, Sparkles, Zap, MapPin, TrendingUp } from 'lucide-react';

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el banner cada vez que se carga la página
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
      <div className="pointer-events-auto animate-fade-in-up">
        {/* Banner Principal */}
        <div className="relative max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* Fondo animado con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1FC16B]/10 via-blue-50/50 to-[#246BFF]/10 animate-gradient"></div>
          
          {/* Patrón de grid decorativo */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFGQzE2QiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
            aria-label="Cerrar banner"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 group-hover:rotate-90 transition-all duration-300" />
          </button>

          {/* Contenido */}
          <div className="relative p-8 space-y-6">
            {/* Header con logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="relative animate-float">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1FC16B] to-[#246BFF] rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Título */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-[#1FC16B] via-[#1a9d5f] to-[#246BFF] bg-clip-text text-transparent animate-gradient">
                ¡Bienvenido a Agendify Routes!
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-[#1FC16B] to-transparent rounded-full"></div>
                <Zap className="w-4 h-4 text-[#1FC16B]" />
                <div className="h-1 w-12 bg-gradient-to-l from-[#246BFF] to-transparent rounded-full"></div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <p className="text-center text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
                Tu <span className="font-bold text-[#1FC16B]">planificador inteligente de rutas</span> que utiliza 
                algoritmos avanzados de grafos para encontrar las mejores rutas entre tus sucursales.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-8 h-8 bg-[#1FC16B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Rutas Óptimas</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-8 h-8 bg-[#246BFF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Algoritmos IA</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Mapas en Tiempo Real</span>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Explora <span className="font-bold text-[#246BFF]">BFS, DFS, Dijkstra, Prim, Kruskal</span> y más algoritmos
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gradient-to-r from-[#1FC16B] to-[#246BFF] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Comenzar Ahora</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#1FC16B]" />
                <span className="text-sm font-bold bg-gradient-to-r from-[#1FC16B] to-[#246BFF] bg-clip-text text-transparent">
                  Gracias Agendify
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
