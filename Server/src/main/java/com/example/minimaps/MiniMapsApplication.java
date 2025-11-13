package com.example.minimaps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

/**
 * Aplicación principal de Mini Maps.
 * Sistema de mapas basado en grafos con Neo4j.
 */
@SpringBootApplication
@EnableNeo4jRepositories
public class MiniMapsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MiniMapsApplication.class, args);
	}

}
