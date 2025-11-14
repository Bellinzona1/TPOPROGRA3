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

  // Cargar datos iniciales
  useEffect(() => {
    cargarMapa();
  }, []);

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
      const response = await axios.get(`${API_URL}/mapa/dijkstra`, {
        params: { origen, destino }
      });

      const data = response.data;
      
      // Encontrar las ciudades del camino
      const caminoCiudades = data.camino.map(nombreCiudad => 
        ciudades.find(c => c.nombre === nombreCiudad)
      ).filter(Boolean);

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
    
    // Si la voz está activa, leer las instrucciones
    if (vozActiva && rutaInfo && rutaInfo.instructions) {
      speechManager.speakInstructions(rutaInfo.instructions);
    }
  };

  // Manejar cambios en el estado de la voz
  const handleVozActivaChange = (activa) => {
    setVozActiva(activa);
    speechManager.setEnabled(activa);
    
    // Si se activa y ya hay instrucciones, leerlas
    if (activa && rutaReal && rutaReal.instructions) {
      speechManager.speakInstructions(rutaReal.instructions);
    } else if (!activa) {
      speechManager.stop();
    }
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
        />
      </div>
    </div>
    </>
  );
}

export default App;
