import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el banner inmediatamente
    setIsVisible(true);

    // Ocultar automáticamente después de 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Fondo verde animado con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a8f4f] via-[#1FC16B] to-[#0edb7a] animate-gradient"></div>
      
      {/* Patrón de grid animado */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 animate-pulse"></div>

      {/* Círculos animados de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/20 rounded-full blur-2xl animate-pulse"></div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-8 animate-scale-in">
        {/* Logo con animación espectacular */}
        <div className="mb-8 flex justify-center">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
            <img 
              src="/icon.png" 
              alt="Agendify" 
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full shadow-2xl ring-8 ring-white/40 bg-white/90 p-4 hover:scale-110 transition-transform duration-500"
            />
            {/* Sparkles flotantes alrededor del logo */}
            <div className="absolute -top-4 -right-4 animate-float">
              <Sparkles className="w-12 h-12 text-yellow-300 filter drop-shadow-lg animate-pulse" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-10 h-10 text-white filter drop-shadow-lg animate-pulse" />
            </div>
            <div className="absolute top-1/2 -right-8 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-8 h-8 text-emerald-200 filter drop-shadow-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Texto GRACIAS AGENDIFY - Ultra grande */}
        <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-6 text-white drop-shadow-2xl animate-fade-in-up tracking-tight leading-none">
          GRACIAS
        </h1>
        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          AGENDIFY
        </h2>

        {/* Línea decorativa animada */}
        <div className="mt-8 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="h-2 w-64 bg-white/40 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-shimmer"></div>
          </div>
        </div>

        {/* Texto secundario */}
        <p className="mt-8 text-2xl md:text-3xl font-bold text-white/90 drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          Tu planificador inteligente de rutas
        </p>

        {/* Sparkles decorativos flotantes */}
        <div className="absolute top-20 left-1/4 animate-float">
          <Sparkles className="w-16 h-16 text-white/60 animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-1/4 animate-float" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-20 h-20 text-white/50 animate-pulse" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '0.8s' }}>
          <Sparkles className="w-12 h-12 text-emerald-100/70 animate-pulse" />
        </div>

        {/* Indicador de tiempo restante */}
        <div className="mt-12 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-semibold text-lg">Cargando experiencia...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de brillo que recorre la pantalla */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    </div>
  );
}
