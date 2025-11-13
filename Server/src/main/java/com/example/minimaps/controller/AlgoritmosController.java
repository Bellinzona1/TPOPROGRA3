package com.example.minimaps.controller;

import com.example.minimaps.dto.Item;
import com.example.minimaps.service.AlgoritmosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para algoritmos generales de programación.
 * Base path: /api/algoritmos
 */
@RestController
@RequestMapping("/api/algoritmos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlgoritmosController {
    
    private final AlgoritmosService algoritmosService;
    
    /**
     * POST /api/algoritmos/greedy/cambio
     * Calcula el cambio de monedas usando algoritmo Greedy.
     * 
     * Body: { "monto": 87, "monedas": [50, 25, 10, 5, 1] }
     * 
     * @param request Objeto con monto y monedas disponibles
     * @return Lista de monedas utilizadas
     */
    @PostMapping("/greedy/cambio")
    public ResponseEntity<List<Integer>> greedyCambio(@RequestBody CambioRequest request) {
        List<Integer> resultado = algoritmosService.greedyCambio(
            request.getMonto(), 
            request.getMonedas()
        );
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * POST /api/algoritmos/quicksort
     * Ordena una lista usando QuickSort.
     * 
     * Body: { "lista": [5, 2, 9, 1, 7, 6] }
     * 
     * @param request Objeto con lista a ordenar
     * @return Lista ordenada
     */
    @PostMapping("/quicksort")
    public ResponseEntity<List<Integer>> quicksort(@RequestBody ListaRequest request) {
        List<Integer> resultado = algoritmosService.quicksort(request.getLista());
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * POST /api/algoritmos/mergesort
     * Ordena una lista usando MergeSort.
     * 
     * Body: { "lista": [5, 2, 9, 1, 7, 6] }
     * 
     * @param request Objeto con lista a ordenar
     * @return Lista ordenada
     */
    @PostMapping("/mergesort")
    public ResponseEntity<List<Integer>> mergesort(@RequestBody ListaRequest request) {
        List<Integer> resultado = algoritmosService.mergesort(request.getLista());
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * POST /api/algoritmos/mochila/dp
     * Resuelve el problema de la mochila usando Programación Dinámica.
     * 
     * Body: {
     *   "capacidad": 50,
     *   "items": [
     *     {"nombre": "Item1", "peso": 10, "valor": 60},
     *     {"nombre": "Item2", "peso": 20, "valor": 100}
     *   ]
     * }
     * 
     * @param request Objeto con capacidad e items
     * @return Valor máximo obtenible
     */
    @PostMapping("/mochila/dp")
    public ResponseEntity<Integer> mochilaDP(@RequestBody MochilaRequest request) {
        int resultado = algoritmosService.mochilaDP(
            request.getCapacidad(),
            request.getItems()
        );
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * POST /api/algoritmos/backtracking/subconjuntos
     * Genera todos los subconjuntos de un conjunto usando Backtracking.
     * 
     * Body: { "lista": [1, 2, 3] }
     * 
     * @param request Objeto con lista de números
     * @return Lista de todos los subconjuntos
     */
    @PostMapping("/backtracking/subconjuntos")
    public ResponseEntity<List<List<Integer>>> subconjuntosBacktracking(
            @RequestBody ListaRequest request) {
        List<List<Integer>> resultado = algoritmosService.subconjuntosBacktracking(
            request.getLista()
        );
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * POST /api/algoritmos/mochila/branch-bound
     * Resuelve el problema de la mochila usando Branch & Bound.
     * 
     * Body: {
     *   "capacidad": 50,
     *   "items": [
     *     {"nombre": "Item1", "peso": 10, "valor": 60},
     *     {"nombre": "Item2", "peso": 20, "valor": 100}
     *   ]
     * }
     * 
     * @param request Objeto con capacidad e items
     * @return Valor máximo obtenible
     */
    @PostMapping("/mochila/branch-bound")
    public ResponseEntity<Integer> mochilaBranchBound(@RequestBody MochilaRequest request) {
        int resultado = algoritmosService.mochilaBranchBound(
            request.getCapacidad(),
            request.getItems()
        );
        return ResponseEntity.ok(resultado);
    }
    
    // ==================== DTOs para Requests ====================
    
    /**
     * DTO para request de cambio de monedas.
     */
    @lombok.Data
    public static class CambioRequest {
        private int monto;
        private List<Integer> monedas;
    }
    
    /**
     * DTO para request con lista de enteros.
     */
    @lombok.Data
    public static class ListaRequest {
        private List<Integer> lista;
    }
    
    /**
     * DTO para request de problema de la mochila.
     */
    @lombok.Data
    public static class MochilaRequest {
        private int capacidad;
        private List<Item> items;
    }
}
