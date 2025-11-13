package com.example.minimaps.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

/**
 * Clase que representa una relación entre dos ciudades en Neo4j.
 * Contiene la distancia en kilómetros y la ciudad destino.
 */
@RelationshipProperties
@Data
@NoArgsConstructor
@AllArgsConstructor
@lombok.EqualsAndHashCode(exclude = "destino")
@lombok.ToString(exclude = "destino")
public class Ruta {
    
    @RelationshipId
    private Long id;
    
    /**
     * Distancia en kilómetros entre la ciudad origen y destino.
     */
    private double distanciaKm;
    
    /**
     * Ciudad destino de esta ruta.
     */
    @TargetNode
    @JsonIgnoreProperties("rutas")
    private Ciudad destino;
    
    public Ruta(double distanciaKm, Ciudad destino) {
        this.distanciaKm = distanciaKm;
        this.destino = destino;
    }
}
