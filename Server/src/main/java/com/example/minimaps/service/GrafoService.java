package com.example.minimaps.service;

import com.example.minimaps.domain.Ciudad;
import com.example.minimaps.domain.Ruta;
import com.example.minimaps.dto.EdgeDTO;
import com.example.minimaps.dto.MapaResponse;
import com.example.minimaps.dto.RutaResponse;
import com.example.minimaps.repository.CiudadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio que maneja la lógica de negocio del grafo de ciudades.
 * Implementa algoritmos de búsqueda y camino mínimo.
 */
@Service
@RequiredArgsConstructor
public class GrafoService {
    
    private final CiudadRepository ciudadRepository;
    
    /**
     * Obtiene el mapa completo con todas las ciudades y sus conexiones.
     * 
     * @return MapaResponse con nodos (ciudades) y aristas (rutas)
     */
    public MapaResponse obtenerMapa() {
        // TODO: Implementar
        // 1. Obtener todas las ciudades desde Neo4j usando findAllWithRutas()
        // 2. Extraer la lista de ciudades (nodos)
        // 3. Construir la lista de EdgeDTO a partir de las rutas
        // 4. Retornar MapaResponse con ambas listas
        
        List<Ciudad> ciudades = ciudadRepository.findAllWithRutas();
        List<EdgeDTO> edges = new ArrayList<>();
        
        // Convertir rutas a EdgeDTO
        for (Ciudad ciudad : ciudades) {
            for (Ruta ruta : ciudad.getRutas()) {
                edges.add(new EdgeDTO(
                    ciudad.getId(),
                    ruta.getDestino().getId(),
                    ruta.getDistanciaKm()
                ));
            }
        }
        
        return new MapaResponse(ciudades, edges);
    }
    
    /**
     * Realiza una búsqueda en anchura (BFS) desde una ciudad origen.
     * 
     * BFS explora el grafo por niveles: primero visita todos los vecinos directos,
     * luego los vecinos de los vecinos, y así sucesivamente.
     * 
     * Complejidad: O(V + E) donde V = vértices, E = aristas
     * 
     * @param origenId ID de la ciudad origen
     * @return Lista de ciudades en el orden visitado por BFS
     */
    public List<Ciudad> bfs(String origenId) {
        // 1. Construir el grafo en memoria
        Map<String, List<Arista>> grafo = construirGrafo();
        Map<String, Ciudad> ciudadesMap = construirMapaCiudades();
        
        // 2. Estructuras para el algoritmo
        Queue<String> cola = new LinkedList<>();
        Set<String> visitados = new HashSet<>();
        List<Ciudad> resultado = new ArrayList<>();
        
        // 3. Inicializar con el nodo origen
        cola.offer(origenId);
        visitados.add(origenId);
        
        // 4. Recorrido BFS
        while (!cola.isEmpty()) {
            String actualId = cola.poll();
            resultado.add(ciudadesMap.get(actualId));
            
            // Explorar vecinos
            List<Arista> vecinos = grafo.getOrDefault(actualId, new ArrayList<>());
            for (Arista arista : vecinos) {
                if (!visitados.contains(arista.destinoId)) {
                    visitados.add(arista.destinoId);
                    cola.offer(arista.destinoId);
                }
            }
        }
        
        return resultado;
    }
    
    /**
     * Realiza una búsqueda en profundidad (DFS) desde una ciudad origen.
     * 
     * DFS explora el grafo yendo lo más profundo posible antes de retroceder.
     * Utiliza un Stack para simular la recursión de manera iterativa.
     * 
     * Complejidad: O(V + E) donde V = vértices, E = aristas
     * 
     * @param origenId ID de la ciudad origen
     * @return Lista de ciudades en el orden visitado por DFS
     */
    public List<Ciudad> dfs(String origenId) {
        // 1. Construir el grafo en memoria
        Map<String, List<Arista>> grafo = construirGrafo();
        Map<String, Ciudad> ciudadesMap = construirMapaCiudades();
        
        // 2. Estructuras para el algoritmo
        Stack<String> pila = new Stack<>();
        Set<String> visitados = new HashSet<>();
        List<Ciudad> resultado = new ArrayList<>();
        
        // 3. Inicializar con el nodo origen
        pila.push(origenId);
        
        // 4. Recorrido DFS
        while (!pila.isEmpty()) {
            String actualId = pila.pop();
            
            if (!visitados.contains(actualId)) {
                visitados.add(actualId);
                resultado.add(ciudadesMap.get(actualId));
                
                // Explorar vecinos (se agregan en orden inverso para mantener orden lógico)
                List<Arista> vecinos = grafo.getOrDefault(actualId, new ArrayList<>());
                for (int i = vecinos.size() - 1; i >= 0; i--) {
                    String vecinoId = vecinos.get(i).destinoId;
                    if (!visitados.contains(vecinoId)) {
                        pila.push(vecinoId);
                    }
                }
            }
        }
        
        return resultado;
    }
    
    /**
     * Calcula el camino mínimo entre dos ciudades usando el algoritmo de Dijkstra.
     * 
     * Dijkstra encuentra el camino más corto entre dos nodos en un grafo con pesos positivos.
     * Utiliza una PriorityQueue para seleccionar siempre el nodo con menor distancia acumulada.
     * 
     * Complejidad: O((V + E) log V) usando PriorityQueue
     * 
     * @param origenId ID de la ciudad origen
     * @param destinoId ID de la ciudad destino
     * @return RutaResponse con el camino y distancia total
     */
    public RutaResponse dijkstra(String origenId, String destinoId) {
        // 1. Construir el grafo en memoria
        Map<String, List<Arista>> grafo = construirGrafo();
        Map<String, Ciudad> ciudadesMap = construirMapaCiudades();
        
        // 2. Estructuras para el algoritmo
        Map<String, Double> distancias = new HashMap<>();
        Map<String, String> predecesores = new HashMap<>();
        PriorityQueue<NodoDijkstra> pq = new PriorityQueue<>();
        Set<String> visitados = new HashSet<>();
        
        // 3. Inicializar distancias a infinito
        for (String ciudadId : grafo.keySet()) {
            distancias.put(ciudadId, Double.POSITIVE_INFINITY);
        }
        distancias.put(origenId, 0.0);
        
        // 4. Agregar nodo origen a la cola de prioridad
        pq.offer(new NodoDijkstra(origenId, 0.0));
        
        // 5. Algoritmo de Dijkstra
        while (!pq.isEmpty()) {
            NodoDijkstra actual = pq.poll();
            String actualId = actual.ciudadId;
            
            if (visitados.contains(actualId)) continue;
            visitados.add(actualId);
            
            // Si llegamos al destino, podemos terminar
            if (actualId.equals(destinoId)) break;
            
            // Explorar vecinos
            List<Arista> vecinos = grafo.getOrDefault(actualId, new ArrayList<>());
            for (Arista arista : vecinos) {
                if (!visitados.contains(arista.destinoId)) {
                    double nuevaDistancia = distancias.get(actualId) + arista.peso;
                    
                    if (nuevaDistancia < distancias.get(arista.destinoId)) {
                        distancias.put(arista.destinoId, nuevaDistancia);
                        predecesores.put(arista.destinoId, actualId);
                        pq.offer(new NodoDijkstra(arista.destinoId, nuevaDistancia));
                    }
                }
            }
        }
        
        // 6. Reconstruir el camino
        List<Ciudad> camino = new ArrayList<>();
        String actual = destinoId;
        
        while (actual != null) {
            camino.add(0, ciudadesMap.get(actual));
            actual = predecesores.get(actual);
        }
        
        double distanciaTotal = distancias.getOrDefault(destinoId, Double.POSITIVE_INFINITY);
        
        return new RutaResponse(origenId, destinoId, distanciaTotal, camino);
    }
    
    /**
     * Construye una lista de adyacencia en memoria desde las ciudades de Neo4j.
     * Útil para implementar los algoritmos de grafos.
     * 
     * @return Map donde la clave es el ID de ciudad y el valor es una lista de pares (destinoId, distancia)
     */
    private Map<String, List<Arista>> construirGrafo() {
        Map<String, List<Arista>> grafo = new HashMap<>();
        
        List<Ciudad> ciudades = ciudadRepository.findAllWithRutas();
        for (Ciudad ciudad : ciudades) {
            List<Arista> aristas = new ArrayList<>();
            for (Ruta ruta : ciudad.getRutas()) {
                aristas.add(new Arista(ruta.getDestino().getId(), ruta.getDistanciaKm()));
            }
            grafo.put(ciudad.getId(), aristas);
        }
        
        return grafo;
    }
    
    /**
     * Construye un mapa de ciudades por ID para acceso rápido.
     * 
     * @return Map donde la clave es el ID de ciudad y el valor es el objeto Ciudad
     */
    private Map<String, Ciudad> construirMapaCiudades() {
        Map<String, Ciudad> ciudadesMap = new HashMap<>();
        List<Ciudad> ciudades = ciudadRepository.findAll();
        
        for (Ciudad ciudad : ciudades) {
            ciudadesMap.put(ciudad.getId(), ciudad);
        }
        
        return ciudadesMap;
    }
    
    /**
     * Calcula el Árbol de Expansión Mínima usando el algoritmo de Prim.
     * 
     * Prim construye el MST agregando en cada paso la arista de menor peso
     * que conecta el árbol actual con un nodo no visitado.
     * 
     * Complejidad: O(E log V) usando PriorityQueue
     * 
     * @return MapaResponse con las aristas del MST
     */
    public MapaResponse prim() {
        // 1. Construir el grafo en memoria
        Map<String, List<Arista>> grafo = construirGrafo();
        Map<String, Ciudad> ciudadesMap = construirMapaCiudades();
        
        if (grafo.isEmpty()) {
            return new MapaResponse(new ArrayList<>(), new ArrayList<>());
        }
        
        // 2. Estructuras para el algoritmo
        Set<String> enMST = new HashSet<>();
        List<EdgeDTO> aristasMST = new ArrayList<>();
        PriorityQueue<AristaPrim> pq = new PriorityQueue<>();
        
        // 3. Comenzar desde el primer nodo
        String nodoInicial = grafo.keySet().iterator().next();
        enMST.add(nodoInicial);
        
        // Agregar todas las aristas del nodo inicial
        for (Arista arista : grafo.get(nodoInicial)) {
            pq.offer(new AristaPrim(nodoInicial, arista.destinoId, arista.peso));
        }
        
        // 4. Algoritmo de Prim
        while (!pq.isEmpty() && enMST.size() < grafo.size()) {
            AristaPrim aristaActual = pq.poll();
            
            // Si el destino ya está en el MST, saltar
            if (enMST.contains(aristaActual.destino)) continue;
            
            // Agregar arista al MST
            enMST.add(aristaActual.destino);
            aristasMST.add(new EdgeDTO(
                aristaActual.origen,
                aristaActual.destino,
                aristaActual.peso
            ));
            
            // Agregar nuevas aristas desde el nodo recién agregado
            List<Arista> vecinos = grafo.getOrDefault(aristaActual.destino, new ArrayList<>());
            for (Arista arista : vecinos) {
                if (!enMST.contains(arista.destinoId)) {
                    pq.offer(new AristaPrim(aristaActual.destino, arista.destinoId, arista.peso));
                }
            }
        }
        
        // 5. Construir respuesta con todas las ciudades y solo aristas del MST
        List<Ciudad> todasCiudades = new ArrayList<>(ciudadesMap.values());
        return new MapaResponse(todasCiudades, aristasMST);
    }
    
    /**
     * Calcula el Árbol de Expansión Mínima usando el algoritmo de Kruskal.
     * 
     * Kruskal ordena todas las aristas por peso y las agrega al MST si no crean ciclos,
     * usando Union-Find para detectar ciclos eficientemente.
     * 
     * Complejidad: O(E log E) por el ordenamiento de aristas
     * 
     * @return MapaResponse con las aristas del MST
     */
    public MapaResponse kruskal() {
        // 1. Construir lista de todas las aristas
        Map<String, List<Arista>> grafo = construirGrafo();
        Map<String, Ciudad> ciudadesMap = construirMapaCiudades();
        List<AristaKruskal> todasAristas = new ArrayList<>();
        
        for (Map.Entry<String, List<Arista>> entry : grafo.entrySet()) {
            String origen = entry.getKey();
            for (Arista arista : entry.getValue()) {
                todasAristas.add(new AristaKruskal(origen, arista.destinoId, arista.peso));
            }
        }
        
        // 2. Ordenar aristas por peso (ascendente)
        todasAristas.sort(Comparator.comparingDouble(a -> a.peso));
        
        // 3. Inicializar Union-Find
        UnionFind uf = new UnionFind(ciudadesMap.keySet());
        List<EdgeDTO> aristasMST = new ArrayList<>();
        
        // 4. Algoritmo de Kruskal
        for (AristaKruskal arista : todasAristas) {
            // Si agregar esta arista no crea un ciclo, agregarla al MST
            if (uf.union(arista.origen, arista.destino)) {
                aristasMST.add(new EdgeDTO(arista.origen, arista.destino, arista.peso));
                
                // Si ya tenemos V-1 aristas, terminamos (MST completo)
                if (aristasMST.size() == ciudadesMap.size() - 1) {
                    break;
                }
            }
        }
        
        // 5. Construir respuesta
        List<Ciudad> todasCiudades = new ArrayList<>(ciudadesMap.values());
        return new MapaResponse(todasCiudades, aristasMST);
    }
    
    /**
     * Clase auxiliar para representar una arista en el grafo en memoria.
     */
    private static class Arista {
        String destinoId;
        double peso;
        
        Arista(String destinoId, double peso) {
            this.destinoId = destinoId;
            this.peso = peso;
        }
    }
    
    /**
     * Clase auxiliar para Dijkstra que representa un nodo con su distancia.
     * Implementa Comparable para usarse en PriorityQueue.
     */
    private static class NodoDijkstra implements Comparable<NodoDijkstra> {
        String ciudadId;
        double distancia;
        
        NodoDijkstra(String ciudadId, double distancia) {
            this.ciudadId = ciudadId;
            this.distancia = distancia;
        }
        
        @Override
        public int compareTo(NodoDijkstra otro) {
            return Double.compare(this.distancia, otro.distancia);
        }
    }
    
    /**
     * Clase auxiliar para Prim que representa una arista con origen, destino y peso.
     */
    private static class AristaPrim implements Comparable<AristaPrim> {
        String origen;
        String destino;
        double peso;
        
        AristaPrim(String origen, String destino, double peso) {
            this.origen = origen;
            this.destino = destino;
            this.peso = peso;
        }
        
        @Override
        public int compareTo(AristaPrim otra) {
            return Double.compare(this.peso, otra.peso);
        }
    }
    
    /**
     * Clase auxiliar para Kruskal que representa una arista.
     */
    private static class AristaKruskal {
        String origen;
        String destino;
        double peso;
        
        AristaKruskal(String origen, String destino, double peso) {
            this.origen = origen;
            this.destino = destino;
            this.peso = peso;
        }
    }
    
    /**
     * Estructura Union-Find (Disjoint Set Union) para detectar ciclos en Kruskal.
     * Utiliza compresión de caminos y unión por rango para eficiencia.
     */
    private static class UnionFind {
        Map<String, String> padre;
        Map<String, Integer> rango;
        
        UnionFind(Set<String> elementos) {
            padre = new HashMap<>();
            rango = new HashMap<>();
            
            for (String elem : elementos) {
                padre.put(elem, elem);
                rango.put(elem, 0);
            }
        }
        
        /**
         * Encuentra el representante del conjunto (con compresión de caminos).
         */
        String find(String x) {
            if (!padre.get(x).equals(x)) {
                padre.put(x, find(padre.get(x)));
            }
            return padre.get(x);
        }
        
        /**
         * Une dos conjuntos. Retorna true si se unieron, false si ya estaban unidos.
         */
        boolean union(String x, String y) {
            String raizX = find(x);
            String raizY = find(y);
            
            if (raizX.equals(raizY)) {
                return false; // Ya están en el mismo conjunto (crearía ciclo)
            }
            
            // Unión por rango
            if (rango.get(raizX) < rango.get(raizY)) {
                padre.put(raizX, raizY);
            } else if (rango.get(raizX) > rango.get(raizY)) {
                padre.put(raizY, raizX);
            } else {
                padre.put(raizY, raizX);
                rango.put(raizX, rango.get(raizX) + 1);
            }
            
            return true;
        }
    }
}
