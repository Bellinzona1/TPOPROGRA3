package com.example.minimaps.dto;

import com.example.minimaps.domain.Ciudad;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO que representa el resultado de un algoritmo de camino mínimo.
 * Contiene el origen, destino, distancia total y el camino recorrido.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RutaResponse {
    
    private String origen;
    
    private String destino;
    
    private double distanciaTotalKm;
    
    /**
     * Lista ordenada de ciudades que forman el camino desde origen hasta destino.
     */
    private List<Ciudad> camino;
}
