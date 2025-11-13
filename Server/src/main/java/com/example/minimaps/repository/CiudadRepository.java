package com.example.minimaps.repository;

import com.example.minimaps.domain.Ciudad;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para acceder a las ciudades almacenadas en Neo4j.
 */
@Repository
public interface CiudadRepository extends Neo4jRepository<Ciudad, String> {
    
    /**
     * Obtiene todas las ciudades con sus rutas cargadas.
     * Esta query es útil para construir el grafo completo en memoria.
     */
    @Query("MATCH (c:Ciudad)-[r:CONECTA_CON]->(d:Ciudad) RETURN c, collect(r), collect(d)")
    List<Ciudad> findAllWithRutas();
    
    /**
     * Encuentra una ciudad por su nombre.
     */
    Ciudad findByNombre(String nombre);
}
