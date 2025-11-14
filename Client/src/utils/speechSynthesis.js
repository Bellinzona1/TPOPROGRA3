/**
 * Utilidad para síntesis de voz usando Web Speech API
 */

class SpeechSynthesisManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.queue = [];
    this.isEnabled = false;
  }

  // Activar/desactivar la síntesis de voz
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  // Hablar un texto
  speak(text, options = {}) {
    if (!this.isEnabled) return;

    // Cancelar COMPLETAMENTE cualquier discurso en curso
    this.synth.cancel();
    this.currentUtterance = null;

    // Pequeño delay para asegurar que se canceló
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configurar voz en español
      const voices = this.synth.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') || voice.lang.startsWith('spa')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.lang = 'es-ES';
      utterance.rate = options.rate || 1.0; // Velocidad (0.1 a 10)
      utterance.pitch = options.pitch || 1.0; // Tono (0 a 2)
      utterance.volume = options.volume || 1.0; // Volumen (0 a 1)

      this.currentUtterance = utterance;
      
      utterance.onend = () => {
        this.currentUtterance = null;
      };
      utterance.onerror = () => {
        this.currentUtterance = null;
      };

      this.synth.speak(utterance);
    }, 100);
  }

  // Detener la síntesis
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.queue = [];
  }

  // Pausar
  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  // Reanudar
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  // Leer todas las instrucciones de ruta
  async speakInstructions(instructions) {
    if (!this.isEnabled || !instructions || instructions.length === 0) return;

    // Mensaje inicial
    await this.speak("Iniciando navegación");
    
    // Esperar un poco entre instrucciones
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      
      // Formatear la instrucción
      let text = instruction.text;
      
      // Agregar distancia si es significativa
      if (instruction.distance > 50) {
        const distanceText = instruction.distance < 1000
          ? `en ${Math.round(instruction.distance)} metros`
          : `en ${(instruction.distance / 1000).toFixed(1)} kilómetros`;
        text = `${text}, ${distanceText}`;
      }
      
      await this.speak(text);
      
      // Pausa entre instrucciones
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Mensaje final
    await this.speak("Ha llegado a su destino");
  }

  // Verificar si el navegador soporta síntesis de voz
  static isSupported() {
    return 'speechSynthesis' in window;
  }
}

// Singleton
const speechManager = new SpeechSynthesisManager();

// Cargar voces cuando estén disponibles
if (SpeechSynthesisManager.isSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Las voces están listas
  };
}

export default speechManager;
