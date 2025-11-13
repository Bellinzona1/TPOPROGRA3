package com.example.minimaps.dto;

import com.example.minimaps.domain.Ciudad;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO que representa el mapa completo con nodos y aristas.
 * Este formato es ideal para renderizar en Leaflet en el frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MapaResponse {
    
    /**
     * Lista de todas las ciudades (nodos del grafo).
     */
    private List<Ciudad> nodes;
    
    /**
     * Lista de todas las rutas (aristas del grafo).
     */
    private List<EdgeDTO> edges;
}
