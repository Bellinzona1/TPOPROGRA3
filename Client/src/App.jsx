import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import WelcomeBanner from './components/WelcomeBanner';
import { mockBranches, haversineDistance } from './utils/mockBranches';
import speechManager from './utils/speechSynthesis';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [ciudades, setCiudades] = useState([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [rutaOptima, setRutaOptima] = useState([]);
  const [todasLasRutas, setTodasLasRutas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [mostrarRutaReal, setMostrarRutaReal] = useState(false);
  const [rutaReal, setRutaReal] = useState(null);
  const [modoSeleccion, setModoSeleccion] = useState(null); // 'origen', 'destino' o null
  const [puntoTemporal, setPuntoTemporal] = useState(null);
  const [origenManual, setOrigenManual] = useState(null);
  const [destinoManual, setDestinoManual] = useState(null);
  const [vozActiva, setVozActiva] = useState(false);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarMapa();
  }, []);

  // Función para obtener ubicación actual
  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setCargandoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const ubicacion = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUbicacionActual(ubicacion);
        setOrigenManual(ubicacion);
        setOrigen('manual');
        setCargandoUbicacion(false);
        console.log('Ubicación actual obtenida:', ubicacion);
      },
      (error) => {
        setCargandoUbicacion(false);
        let mensaje = 'Error al obtener ubicación';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            mensaje = 'Permiso denegado. Por favor, permite el acceso a tu ubicación.';
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = 'Ubicación no disponible.';
            break;
          case error.TIMEOUT:
            mensaje = 'Tiempo de espera agotado.';
            break;
        }
        alert(mensaje);
        console.error('Error de geolocalización:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const cargarMapa = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/mapa`);
      const data = response.data;
      
      if (data.nodes && data.nodes.length > 0) {
        setCiudades(data.nodes);
        
        // Procesar todas las rutas para visualización
        const rutasVisuales = [];
        data.nodes.forEach(ciudad => {
          if (ciudad.rutas) {
            ciudad.rutas.forEach(ruta => {
              if (ruta.destino) {
                rutasVisuales.push({
                  coords: [
                    [ciudad.lat, ciudad.lng],
                    [ruta.destino.lat, ruta.destino.lng]
                  ],
                  distancia: ruta.distanciaKm
                });
              }
            });
          }
        });
        setTodasLasRutas(rutasVisuales);

        // Calcular estadísticas
        setStats({
          ciudades: data.nodes.length,
          rutas: rutasVisuales.length
        });
      }
    } catch (error) {
      console.error('Error al cargar el mapa:', error);
      alert('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo en el puerto 8080.');
    } finally {
      setLoading(false);
    }
  };

  const calcularRuta = async () => {
    if (!origen || !destino) {
      alert('Por favor selecciona origen y destino');
      return;
    }

    try {
      setLoading(true);
      setRutaReal(null); // Limpiar ruta real anterior
      
      // Activar automáticamente la ruta real con calles
      setMostrarRutaReal(true);
      
      const response = await axios.get(`${API_URL}/mapa/dijkstra`, {
        params: { origen, destino }
      });

      const data = response.data;
      
      console.log('Dijkstra response:', data);
      console.log('Ciudades disponibles:', ciudades);
      
      // Encontrar las ciudades del camino
      const caminoCiudades = data.camino.map(nombreCiudad => {
        const ciudad = ciudades.find(c => c.nombre === nombreCiudad);
        console.log(`Buscando "${nombreCiudad}":`, ciudad);
        return ciudad;
      }).filter(Boolean);

      console.log('Camino ciudades encontradas:', caminoCiudades);

      setRutaOptima(caminoCiudades);
      setResultado({
        tipo: 'dijkstra',
        camino: data.camino,
        distancia: data.distanciaTotal
      });
    } catch (error) {
      console.error('Error al calcular ruta:', error);
      alert('Error al calcular la ruta');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarBFS = async () => {
    if (!origen) {
      alert('Por favor selecciona una ciudad de origen');
      return;
    }

    try {
      setLoading(true);
      setRutaReal(null); // Limpiar ruta real
      setMostrarRutaReal(false); // Desactivar vista de ruta real
      const response = await axios.get(`${API_URL}/mapa/bfs`, {
        params: { origen }
      });

      const data = response.data;
      
      // data es directamente un array de objetos Ciudad
      const caminoCiudades = data.map(ciudad => 
        ciudades.find(c => c.id === ciudad.id)
      ).filter(Boolean);

      const nombresCiudades = data.map(c => c.nombre);

      setRutaOptima(caminoCiudades);
      setResultado({
        tipo: 'bfs',
        camino: nombresCiudades
      });
    } catch (error) {
      console.error('Error al ejecutar BFS:', error);
      alert('Error al ejecutar BFS');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarDFS = async () => {
    if (!origen) {
      alert('Por favor selecciona una ciudad de origen');
      return;
    }

    try {
      setLoading(true);
      setRutaReal(null); // Limpiar ruta real
      setMostrarRutaReal(false); // Desactivar vista de ruta real
      const response = await axios.get(`${API_URL}/mapa/dfs`, {
        params: { origen }
      });

      const data = response.data;
      
      // data es directamente un array de objetos Ciudad
      const caminoCiudades = data.map(ciudad => 
        ciudades.find(c => c.id === ciudad.id)
      ).filter(Boolean);

      const nombresCiudades = data.map(c => c.nombre);

      setRutaOptima(caminoCiudades);
      setResultado({
        tipo: 'dfs',
        camino: nombresCiudades
      });
    } catch (error) {
      console.error('Error al ejecutar DFS:', error);
      alert('Error al ejecutar DFS');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarPrim = async () => {
    if (!origen) {
      alert('Por favor selecciona una ciudad de origen');
      return;
    }

    try {
      setLoading(true);
      setRutaReal(null); // Limpiar ruta real
      setMostrarRutaReal(false); // Desactivar vista de ruta real
      const response = await axios.get(`${API_URL}/mapa/prim`, {
        params: { origen }
      });

      const data = response.data;
      
      // data es MapaResponse con nodes y edges
      const nodosUnicos = new Set();
      let pesoTotal = 0;
      
      const aristas = data.edges?.map(edge => {
        const origenCiudad = ciudades.find(c => c.id === edge.origenId);
        const destinoCiudad = ciudades.find(c => c.id === edge.destinoId);
        
        if (origenCiudad) nodosUnicos.add(origenCiudad.nombre);
        if (destinoCiudad) nodosUnicos.add(destinoCiudad.nombre);
        pesoTotal += edge.distanciaKm;
        
        return {
          origen: origenCiudad?.nombre || edge.origenId,
          destino: destinoCiudad?.nombre || edge.destinoId,
          peso: edge.distanciaKm
        };
      }) || [];
      
      const nodosCiudades = Array.from(nodosUnicos).map(nombre =>
        ciudades.find(c => c.nombre === nombre)
      ).filter(Boolean);

      setRutaOptima(nodosCiudades);
      setResultado({
        tipo: 'prim',
        aristas: aristas,
        pesoTotal: pesoTotal
      });
    } catch (error) {
      console.error('Error al ejecutar Prim:', error);
      alert('Error al ejecutar Prim');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarKruskal = async () => {
    try {
      setLoading(true);
      setRutaReal(null); // Limpiar ruta real
      setMostrarRutaReal(false); // Desactivar vista de ruta real
      const response = await axios.get(`${API_URL}/mapa/kruskal`);

      const data = response.data;
      
      // data es MapaResponse con nodes y edges
      const nodosUnicos = new Set();
      let pesoTotal = 0;
      
      const aristas = data.edges?.map(edge => {
        const origenCiudad = ciudades.find(c => c.id === edge.origenId);
        const destinoCiudad = ciudades.find(c => c.id === edge.destinoId);
        
        if (origenCiudad) nodosUnicos.add(origenCiudad.nombre);
        if (destinoCiudad) nodosUnicos.add(destinoCiudad.nombre);
        pesoTotal += edge.distanciaKm;
        
        return {
          origen: origenCiudad?.nombre || edge.origenId,
          destino: destinoCiudad?.nombre || edge.destinoId,
          peso: edge.distanciaKm
        };
      }) || [];
      
      const nodosCiudades = Array.from(nodosUnicos).map(nombre =>
        ciudades.find(c => c.nombre === nombre)
      ).filter(Boolean);

      setRutaOptima(nodosCiudades);
      setResultado({
        tipo: 'kruskal',
        aristas: aristas,
        pesoTotal: pesoTotal
      });
    } catch (error) {
      console.error('Error al ejecutar Kruskal:', error);
      alert('Error al ejecutar Kruskal');
    } finally {
      setLoading(false);
    }
  };

  const handleRutaRealEncontrada = (rutaInfo) => {
    setRutaReal(rutaInfo);
    // No leer todas las instrucciones aquí, se leerán paso a paso en MapView
  };

  // Manejar cambios en el estado de la voz
  const handleVozActivaChange = (activa) => {
    setVozActiva(activa);
    speechManager.setEnabled(activa);
    
    // Si se desactiva, detener la reproducción
    if (!activa) {
      speechManager.stop();
    }
    // Si se activa, la primera instrucción se leerá automáticamente en MapView
  };

  const handleSeleccionManualOrigen = () => {
    setModoSeleccion(modoSeleccion === 'origen' ? null : 'origen');
    setPuntoTemporal(null);
  };

  const handleSeleccionManualDestino = () => {
    setModoSeleccion(modoSeleccion === 'destino' ? null : 'destino');
    setPuntoTemporal(null);
  };

  const handlePuntoSeleccionado = (punto) => {
    setPuntoTemporal(punto);
    
    if (modoSeleccion === 'origen') {
      setOrigenManual(punto);
      setOrigen('manual');
      setModoSeleccion(null);
    } else if (modoSeleccion === 'destino') {
      setDestinoManual(punto);
      setDestino('manual');
      setModoSeleccion(null);
    }
  };

  // Obtener coordenadas de origen y destino (de ciudad o punto manual)
  const getCoordenadas = (tipo) => {
    if (tipo === 'origen') {
      if (origen === 'manual' && origenManual) {
        return origenManual;
      }
      return ciudades.find(c => c.id === origen);
    } else {
      if (destino === 'manual' && destinoManual) {
        return destinoManual;
      }
      return ciudades.find(c => c.id === destino);
    }
  };

  // ========== ALGORITMOS GENERALES ==========

  // 1. Ordenar ciudades por distancia usando QuickSort
  const ordenarCiudades = async () => {
    if (!origen) {
      alert('⚠️ Selecciona un punto de origen primero');
      return;
    }

    if (ciudades.length === 0) {
      alert('⚠️ No hay ciudades cargadas');
      return;
    }

    try {
      setLoading(true);
      const coordOrigen = getCoordenadas('origen');
      
      if (!coordOrigen) {
        alert('⚠️ No se pudo obtener las coordenadas del origen');
        setLoading(false);
        return;
      }
      
      // Calcular distancias desde el origen a todas las ciudades
      const distancias = ciudades.map(ciudad => {
        const dist = haversineDistance(
          { lat: coordOrigen.lat, lng: coordOrigen.lng },
          { lat: ciudad.lat, lng: ciudad.lng }
        );
        return Math.round(dist * 10); // Multiplicar por 10 para tener enteros
      });

      console.log('Distancias a ordenar:', distancias);

      // Llamar a QuickSort del backend
      const response = await axios.post(`${API_URL}/algoritmos/quicksort`, {
        lista: distancias
      });

      const distanciasOrdenadas = response.data;
      
      // Crear mapeo distancia -> ciudad
      const mapaDistancias = new Map();
      ciudades.forEach(ciudad => {
        const dist = Math.round(haversineDistance(
          { lat: coordOrigen.lat, lng: coordOrigen.lng },
          { lat: ciudad.lat, lng: ciudad.lng }
        ) * 10);
        if (!mapaDistancias.has(dist)) {
          mapaDistancias.set(dist, ciudad);
        }
      });

      // Crear resultado visual
      const ciudadesOrdenadas = distanciasOrdenadas
        .map(dist => {
          const ciudad = mapaDistancias.get(dist);
          if (ciudad) {
            return `${ciudad.nombre}: ${(dist / 10).toFixed(1)} km`;
          }
          return null;
        })
        .filter(Boolean);

      alert(`🎯 CIUDADES ORDENADAS POR DISTANCIA\n\nAlgoritmo: QuickSort\nOrigen: ${coordOrigen.nombre || 'Punto Manual'}\n\n${ciudadesOrdenadas.join('\n')}`);
    } catch (error) {
      console.error('Error al ordenar ciudades:', error);
      alert(`❌ Error al ordenar ciudades:\n${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Calcular cambio de peajes usando Greedy
  const calcularPeajes = async () => {
    if (!rutaReal) {
      alert('Calcula una ruta primero');
      return;
    }

    try {
      setLoading(true);
      const distanciaKm = rutaReal.totalDistance / 1000;
      const costoPeaje = Math.round(distanciaKm * 0.5); // $0.50 por km
      
      // Simular pago de peaje
      const pagoCon = Math.ceil(costoPeaje / 100) * 100; // Redondear hacia arriba a centena
      const cambio = pagoCon - costoPeaje;

      // Llamar a algoritmo Greedy para calcular cambio
      const response = await axios.post(`${API_URL}/algoritmos/greedy/cambio`, {
        monto: cambio,
        monedas: [100, 50, 20, 10, 5, 1]
      });

      const monedasCambio = response.data;
      const conteo = {};
      monedasCambio.forEach(m => {
        conteo[m] = (conteo[m] || 0) + 1;
      });

      const desglose = Object.entries(conteo)
        .map(([moneda, cant]) => `${cant} x $${moneda}`)
        .join('\n');

      alert(
        `💰 CÁLCULO DE PEAJES\n\n` +
        `Distancia: ${distanciaKm.toFixed(1)} km\n` +
        `Costo peaje: $${costoPeaje}\n` +
        `Pagas con: $${pagoCon}\n` +
        `Cambio: $${cambio}\n\n` +
        `Monedas del cambio:\n${desglose}\n\n` +
        `Total de monedas: ${monedasCambio.length}`
      );
    } catch (error) {
      console.error('Error al calcular peajes:', error);
      alert('Error al calcular peajes');
    } finally {
      setLoading(false);
    }
  };

  // 3. Optimizar carga del vehículo usando Programación Dinámica (Mochila)
  const optimizarCarga = async () => {
    if (!rutaReal) {
      alert('Calcula una ruta primero');
      return;
    }

    try {
      setLoading(true);
      
      // Items de ejemplo basados en la distancia
      const items = [
        { nombre: 'Documentos', peso: 2, valor: 100 },
        { nombre: 'Laptop', peso: 5, valor: 500 },
        { nombre: 'Herramientas', peso: 10, valor: 200 },
        { nombre: 'Muestras', peso: 8, valor: 300 },
        { nombre: 'Material promocional', peso: 15, valor: 150 },
        { nombre: 'Equipamiento', peso: 20, valor: 400 },
      ];

      const capacidadVehiculo = 30; // kg

      // Llamar a algoritmo de Programación Dinámica
      const response = await axios.post(`${API_URL}/algoritmos/mochila/dp`, {
        capacidad: capacidadVehiculo,
        items: items
      });

      const valorMaximo = response.data;

      // Calcular qué items llevar (reconstrucción de solución simplificada)
      const itemsSeleccionados = items
        .sort((a, b) => (b.valor / b.peso) - (a.valor / a.peso))
        .reduce((acc, item) => {
          const pesoActual = acc.reduce((sum, i) => sum + i.peso, 0);
          if (pesoActual + item.peso <= capacidadVehiculo) {
            acc.push(item);
          }
          return acc;
        }, []);

      const pesoTotal = itemsSeleccionados.reduce((sum, i) => sum + i.peso, 0);
      const listaItems = itemsSeleccionados.map(i => `• ${i.nombre} (${i.peso}kg - $${i.valor})`).join('\n');

      alert(
        `📦 OPTIMIZACIÓN DE CARGA\n\n` +
        `Capacidad del vehículo: ${capacidadVehiculo} kg\n` +
        `Distancia del viaje: ${(rutaReal.totalDistance / 1000).toFixed(1)} km\n\n` +
        `Items a llevar:\n${listaItems}\n\n` +
        `Peso total: ${pesoTotal} kg\n` +
        `Valor total: $${valorMaximo}\n` +
        `Espacio libre: ${capacidadVehiculo - pesoTotal} kg`
      );
    } catch (error) {
      console.error('Error al optimizar carga:', error);
      alert('Error al optimizar carga');
    } finally {
      setLoading(false);
    }
  };

  // 4. Comparar QuickSort vs MergeSort
  const compararOrdenamiento = async () => {
    if (!origen) {
      alert('⚠️ Selecciona un punto de origen primero');
      return;
    }

    if (ciudades.length === 0) {
      alert('⚠️ No hay ciudades cargadas');
      return;
    }

    try {
      setLoading(true);
      const coordOrigen = getCoordenadas('origen');
      
      if (!coordOrigen) {
        alert('⚠️ No se pudo obtener las coordenadas del origen');
        setLoading(false);
        return;
      }
      
      // Calcular distancias desde el origen a todas las ciudades
      const distancias = ciudades.map(ciudad => {
        const dist = haversineDistance(
          { lat: coordOrigen.lat, lng: coordOrigen.lng },
          { lat: ciudad.lat, lng: ciudad.lng }
        );
        return Math.round(dist * 10);
      });

      console.log('Comparando con distancias:', distancias);

      // Medir tiempo QuickSort
      const t1 = performance.now();
      const responseQuick = await axios.post(`${API_URL}/algoritmos/quicksort`, {
        lista: [...distancias]
      });
      const tiempoQuick = (performance.now() - t1).toFixed(2);

      // Medir tiempo MergeSort
      const t2 = performance.now();
      const responseMerge = await axios.post(`${API_URL}/algoritmos/mergesort`, {
        lista: [...distancias]
      });
      const tiempoMerge = (performance.now() - t2).toFixed(2);

      const ganador = parseFloat(tiempoQuick) < parseFloat(tiempoMerge) ? 'QuickSort 🔵' : 'MergeSort 🟢';

      alert(
        `⚡ COMPARACIÓN DE ALGORITMOS\n\n` +
        `Dataset: ${distancias.length} ciudades\n` +
        `Origen: ${coordOrigen.nombre || 'Punto Manual'}\n\n` +
        `🔵 QuickSort:\n` +
        `   Tiempo: ${tiempoQuick} ms\n` +
        `   Complejidad: O(n log n) promedio\n\n` +
        `🟢 MergeSort:\n` +
        `   Tiempo: ${tiempoMerge} ms\n` +
        `   Complejidad: O(n log n) garantizado\n\n` +
        `🏆 Ganador: ${ganador}\n\n` +
        `Nota: MergeSort es más estable pero usa más memoria`
      );
    } catch (error) {
      console.error('Error al comparar ordenamiento:', error);
      alert(`❌ Error al comparar algoritmos:\n${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 5. Optimización avanzada con Branch & Bound
  const optimizarCargaAvanzada = async () => {
    if (!rutaReal) {
      alert('Calcula una ruta primero');
      return;
    }

    try {
      setLoading(true);
      
      // Items más complejos para Branch & Bound
      const items = [
        { nombre: 'Documentos urgentes', peso: 2, valor: 150 },
        { nombre: 'Laptop + accesorios', peso: 5, valor: 600 },
        { nombre: 'Herramientas especializadas', peso: 10, valor: 350 },
        { nombre: 'Muestras médicas', peso: 3, valor: 800 },
        { nombre: 'Equipamiento técnico', peso: 12, valor: 450 },
        { nombre: 'Material promocional', peso: 8, valor: 200 },
        { nombre: 'Repuestos críticos', peso: 15, valor: 900 },
      ];

      const capacidadVehiculo = 30;

      // Comparar DP vs Branch & Bound
      const t1 = performance.now();
      const responseDP = await axios.post(`${API_URL}/algoritmos/mochila/dp`, {
        capacidad: capacidadVehiculo,
        items: items
      });
      const tiempoDP = (performance.now() - t1).toFixed(2);

      const t2 = performance.now();
      const responseBB = await axios.post(`${API_URL}/algoritmos/mochila/branch-bound`, {
        capacidad: capacidadVehiculo,
        items: items
      });
      const tiempoBB = (performance.now() - t2).toFixed(2);

      const valorMaximo = responseBB.data;

      alert(
        `🚀 OPTIMIZACIÓN ULTRA AVANZADA\n\n` +
        `Algoritmo: Branch & Bound\n` +
        `Items disponibles: ${items.length}\n` +
        `Capacidad: ${capacidadVehiculo} kg\n\n` +
        `📊 Comparación:\n` +
        `• Programación Dinámica: ${tiempoDP} ms\n` +
        `• Branch & Bound: ${tiempoBB} ms\n\n` +
        `💎 Valor máximo optimizado: $${valorMaximo}\n\n` +
        `Ventaja: Branch & Bound usa podas inteligentes\n` +
        `para encontrar la solución óptima más rápido\n` +
        `en datasets grandes.`
      );
    } catch (error) {
      console.error('Error en optimización avanzada:', error);
      alert('Error en optimización avanzada');
    } finally {
      setLoading(false);
    }
  };

  // 6. Generar combinaciones de paradas usando Backtracking
  const generarCombinaciones = async () => {
    try {
      setLoading(true);
      
      // Tomar las primeras 4 ciudades para generar subconjuntos
      const ciudadesParaCombinar = ciudades.slice(0, 4);
      const indices = ciudadesParaCombinar.map((_, i) => i);

      // Llamar a algoritmo de Backtracking
      const response = await axios.post(`${API_URL}/algoritmos/backtracking/subconjuntos`, {
        lista: indices
      });

      const subconjuntos = response.data;
      
      // Convertir índices a nombres de ciudades
      const combinaciones = subconjuntos
        .filter(s => s.length > 0 && s.length <= 3) // Solo combinaciones de 1-3 paradas
        .map(subset => 
          subset.map(idx => ciudadesParaCombinar[idx].nombre).join(' → ')
        );

      const top10 = combinaciones.slice(0, 10);

      alert(
        `🔄 COMBINACIONES DE PARADAS\n\n` +
        `Algoritmo: Backtracking\n` +
        `Ciudades base: ${ciudadesParaCombinar.map(c => c.nombre).join(', ')}\n` +
        `Total de combinaciones: ${subconjuntos.length}\n\n` +
        `📋 Rutas posibles (top 10):\n\n` +
        `${top10.join('\n')}\n\n` +
        `Usa esto para planificar rutas multi-parada`
      );
    } catch (error) {
      console.error('Error al generar combinaciones:', error);
      alert('Error al generar combinaciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WelcomeBanner />
      <div className="flex h-screen">
        <Sidebar
          ciudades={ciudades}
          origen={origen}
          setOrigen={setOrigen}
          destino={destino}
          setDestino={setDestino}
          onCalcularRuta={calcularRuta}
          resultado={resultado}
          loading={loading}
          onBFS={ejecutarBFS}
          onDFS={ejecutarDFS}
          onPrim={ejecutarPrim}
          onKruskal={ejecutarKruskal}
        stats={stats}
        rutaReal={rutaReal}
        mostrarRutaReal={mostrarRutaReal}
        setMostrarRutaReal={setMostrarRutaReal}
        modoSeleccion={modoSeleccion}
        setModoSeleccion={setModoSeleccion}
        onSeleccionManualOrigen={handleSeleccionManualOrigen}
        onSeleccionManualDestino={handleSeleccionManualDestino}
        origenManual={origenManual}
        destinoManual={destinoManual}
        vozActiva={vozActiva}
        onVozActivaChange={handleVozActivaChange}
        onObtenerUbicacionActual={obtenerUbicacionActual}
        cargandoUbicacion={cargandoUbicacion}
        onOrdenarCiudades={ordenarCiudades}
        onCompararOrdenamiento={compararOrdenamiento}
        onCalcularPeajes={calcularPeajes}
        onGenerarCombinaciones={generarCombinaciones}
      />
      <div className="flex-1">
        <MapView
          ciudades={ciudades}
          rutaOptima={rutaOptima}
          origen={origen}
          destino={destino}
          todasLasRutas={todasLasRutas}
          mostrarRutaReal={mostrarRutaReal}
          onRutaRealEncontrada={handleRutaRealEncontrada}
          modoSeleccion={modoSeleccion}
          onPuntoSeleccionado={handlePuntoSeleccionado}
          puntoTemporal={puntoTemporal}
          origenManual={origenManual}
          destinoManual={destinoManual}
          rutaReal={rutaReal}
          vozActiva={vozActiva}
        />
      </div>
    </div>
    </>
  );
}

export default App;
