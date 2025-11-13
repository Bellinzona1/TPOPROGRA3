package com.example.minimaps.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa una arista (edge) del grafo para el frontend.
 * Contiene los IDs de las ciudades origen y destino, más la distancia.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EdgeDTO {
    
    private String origenId;
    
    private String destinoId;
    
    private double distanciaKm;
}
