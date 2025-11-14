import React from 'react';

export default function AgendifyPrimaryButton({ label = 'Crear cuenta', onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full py-4 rounded-2xl text-white font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#1FC16B]/30 overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1FC16B 0%, #246BFF 100%)',
      }}
    >
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
      
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center gap-2 text-base">
        {label}
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </button>
  );
}
