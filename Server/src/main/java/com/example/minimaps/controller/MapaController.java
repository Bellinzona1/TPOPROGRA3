package com.example.minimaps.controller;

import com.example.minimaps.domain.Ciudad;
import com.example.minimaps.dto.MapaResponse;
import com.example.minimaps.dto.RutaResponse;
import com.example.minimaps.service.GrafoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST que expone los endpoints del mapa y algoritmos de grafos.
 * Base path: /api/mapa
 */
@RestController
@RequestMapping("/api/mapa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MapaController {
    
    private final GrafoService grafoService;
    
    /**
     * GET /api/mapa
     * Obtiene el mapa completo con todas las ciudades y rutas.
     * 
     * @return MapaResponse con nodos (ciudades) y aristas (rutas)
     */
    @GetMapping
    public ResponseEntity<MapaResponse> obtenerMapa() {
        MapaResponse mapa = grafoService.obtenerMapa();
        return ResponseEntity.ok(mapa);
    }
    
    /**
     * GET /api/mapa/bfs?origen=X
     * Ejecuta BFS desde una ciudad origen.
     * 
     * @param origen ID de la ciudad origen
     * @return Lista de ciudades visitadas en orden BFS
     */
    @GetMapping("/bfs")
    public ResponseEntity<List<Ciudad>> bfs(@RequestParam String origen) {
        List<Ciudad> resultado = grafoService.bfs(origen);
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * GET /api/mapa/dfs?origen=X
     * Ejecuta DFS desde una ciudad origen.
     * 
     * @param origen ID de la ciudad origen
     * @return Lista de ciudades visitadas en orden DFS
     */
    @GetMapping("/dfs")
    public ResponseEntity<List<Ciudad>> dfs(@RequestParam String origen) {
        List<Ciudad> resultado = grafoService.dfs(origen);
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * GET /api/mapa/dijkstra?origen=X&destino=Y
     * Calcula el camino mínimo entre dos ciudades usando Dijkstra.
     * 
     * @param origen ID de la ciudad origen
     * @param destino ID de la ciudad destino
     * @return RutaResponse con el camino mínimo y distancia total
     */
    @GetMapping("/dijkstra")
    public ResponseEntity<RutaResponse> dijkstra(
            @RequestParam String origen,
            @RequestParam String destino) {
        RutaResponse ruta = grafoService.dijkstra(origen, destino);
        return ResponseEntity.ok(ruta);
    }
    
    /**
     * GET /api/mapa/prim
     * Calcula el Árbol de Expansión Mínima usando el algoritmo de Prim.
     * 
     * @return MapaResponse con las aristas del MST
     */
    @GetMapping("/prim")
    public ResponseEntity<MapaResponse> prim() {
        MapaResponse mst = grafoService.prim();
        return ResponseEntity.ok(mst);
    }
    
    /**
     * GET /api/mapa/kruskal
     * Calcula el Árbol de Expansión Mínima usando el algoritmo de Kruskal.
     * 
     * @return MapaResponse con las aristas del MST
     */
    @GetMapping("/kruskal")
    public ResponseEntity<MapaResponse> kruskal() {
        MapaResponse mst = grafoService.kruskal();
        return ResponseEntity.ok(mst);
    }
}
