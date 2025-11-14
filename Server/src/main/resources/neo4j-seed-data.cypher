// Script de Neo4j para poblar la base de datos con ciudades argentinas
// Ejecutar en Neo4j Browser (http://localhost:7474)

// 1. Limpiar base de datos (opcional, solo si necesitas resetear)
MATCH (n) DETACH DELETE n;

// 2. Crear ciudades principales de Argentina
CREATE (bsas:Ciudad {id: 'bsas', nombre: 'Buenos Aires', lat: -34.6037, lng: -58.3816})
CREATE (cordoba:Ciudad {id: 'cordoba', nombre: 'Córdoba', lat: -31.4201, lng: -64.1888})
CREATE (rosario:Ciudad {id: 'rosario', nombre: 'Rosario', lat: -32.9442, lng: -60.6505})
CREATE (mdq:Ciudad {id: 'mdq', nombre: 'Mar del Plata', lat: -38.0055, lng: -57.5426})
CREATE (mendoza:Ciudad {id: 'mendoza', nombre: 'Mendoza', lat: -32.8895, lng: -68.8458})
CREATE (salta:Ciudad {id: 'salta', nombre: 'Salta', lat: -24.7821, lng: -65.4232})
CREATE (tucuman:Ciudad {id: 'tucuman', nombre: 'San Miguel de Tucumán', lat: -26.8083, lng: -65.2176})
CREATE (bariloche:Ciudad {id: 'bariloche', nombre: 'San Carlos de Bariloche', lat: -41.1335, lng: -71.3103})
CREATE (chubut:Ciudad {id: 'chubut', nombre: 'Rawson (Chubut)', lat: -43.3002, lng: -65.1023})
CREATE (misiones:Ciudad {id: 'misiones', nombre: 'Posadas (Misiones)', lat: -27.3671, lng: -55.8961})
CREATE (corrientes:Ciudad {id: 'corrientes', nombre: 'Corrientes', lat: -27.4806, lng: -58.8341});

// 3. Crear rutas bidireccionales con distancias aproximadas en km
// Buenos Aires - Rosario
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 300}]->(rosario)
CREATE (rosario)-[:CONECTA_CON {distanciaKm: 300}]->(bsas)

// Buenos Aires - Córdoba
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 700}]->(cordoba)
CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 700}]->(bsas)

// Buenos Aires - Mar del Plata
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 404}]->(mdq)
CREATE (mdq)-[:CONECTA_CON {distanciaKm: 404}]->(bsas)

// Rosario - Córdoba
CREATE (rosario)-[:CONECTA_CON {distanciaKm: 350}]->(cordoba)
CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 350}]->(rosario)

// Córdoba - Mendoza
CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 600}]->(mendoza)
CREATE (mendoza)-[:CONECTA_CON {distanciaKm: 600}]->(cordoba)

// Córdoba - Tucumán
CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 550}]->(tucuman)
CREATE (tucuman)-[:CONECTA_CON {distanciaKm: 550}]->(cordoba)

// Tucumán - Salta
CREATE (tucuman)-[:CONECTA_CON {distanciaKm: 311}]->(salta)
CREATE (salta)-[:CONECTA_CON {distanciaKm: 311}]->(tucuman)

// Buenos Aires - Bariloche
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 1640}]->(bariloche)
CREATE (bariloche)-[:CONECTA_CON {distanciaKm: 1640}]->(bsas)

// Mendoza - Bariloche
CREATE (mendoza)-[:CONECTA_CON {distanciaKm: 1080}]->(bariloche)
CREATE (bariloche)-[:CONECTA_CON {distanciaKm: 1080}]->(mendoza)

// Bariloche - Chubut
CREATE (bariloche)-[:CONECTA_CON {distanciaKm: 530}]->(chubut)
CREATE (chubut)-[:CONECTA_CON {distanciaKm: 530}]->(bariloche)

// Buenos Aires - Chubut
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 1400}]->(chubut)
CREATE (chubut)-[:CONECTA_CON {distanciaKm: 1400}]->(bsas)

// Buenos Aires - Corrientes
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 1040}]->(corrientes)
CREATE (corrientes)-[:CONECTA_CON {distanciaKm: 1040}]->(bsas)

// Corrientes - Misiones
CREATE (corrientes)-[:CONECTA_CON {distanciaKm: 340}]->(misiones)
CREATE (misiones)-[:CONECTA_CON {distanciaKm: 340}]->(corrientes)

// Rosario - Corrientes
CREATE (rosario)-[:CONECTA_CON {distanciaKm: 750}]->(corrientes)
CREATE (corrientes)-[:CONECTA_CON {distanciaKm: 750}]->(rosario)

// Tucumán - Corrientes
CREATE (tucuman)-[:CONECTA_CON {distanciaKm: 720}]->(corrientes)
CREATE (corrientes)-[:CONECTA_CON {distanciaKm: 720}]->(tucuman);

// 4. Verificar que todo se creó correctamente
MATCH (c:Ciudad)-[r:CONECTA_CON]->(d:Ciudad)
RETURN c.nombre AS origen, d.nombre AS destino, r.distanciaKm AS distancia
ORDER BY origen;

// 5. Ver el grafo completo visualmente
MATCH (c:Ciudad)-[r:CONECTA_CON]->(d:Ciudad)
RETURN c, r, d;
