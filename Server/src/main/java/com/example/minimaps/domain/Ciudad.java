package com.example.minimaps.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa un nodo Ciudad en Neo4j.
 * Cada ciudad tiene coordenadas geográficas (lat, lng) y rutas hacia otras ciudades.
 */
@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
@lombok.EqualsAndHashCode(exclude = "rutas")
@lombok.ToString(exclude = "rutas")
public class Ciudad {
    
    @Id
    private String id;
    
    private String nombre;
    
    private double lat;
    
    private double lng;
    
    /**
     * Relaciones salientes hacia otras ciudades.
     * Cada ruta tiene una distancia en kilómetros.
     */
    @Relationship(type = "CONECTA_CON", direction = Relationship.Direction.OUTGOING)
    private Set<Ruta> rutas = new HashSet<>();
    
    public Ciudad(String id, String nombre, double lat, double lng) {
        this.id = id;
        this.nombre = nombre;
        this.lat = lat;
        this.lng = lng;
        this.rutas = new HashSet<>();
    }
}
