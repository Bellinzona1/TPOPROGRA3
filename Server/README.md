# Mini Maps - Sistema de Mapas con Grafos y Neo4j

Proyecto Spring Boot que modela un sistema de mapas simplificado tipo Google Maps usando grafos de ciudades almacenados en Neo4j. Implementa **11 algoritmos fundamentales** de programación y estructuras de datos.

## 🚀 Características

### Algoritmos sobre Grafos (5)
- **BFS** (Breadth-First Search) - Búsqueda en anchura
- **DFS** (Depth-First Search) - Búsqueda en profundidad
- **Dijkstra** - Camino mínimo entre dos nodos
- **Prim** - Árbol de expansión mínima
- **Kruskal** - Árbol de expansión mínima (con Union-Find)

### Algoritmos Generales (6)
- **Greedy** - Problema del cambio de monedas
- **QuickSort** - Ordenamiento (Divide y Conquista)
- **MergeSort** - Ordenamiento (Divide y Conquista)
- **Programación Dinámica** - Problema de la mochila (0/1 Knapsack)
- **Backtracking** - Generación de subconjuntos
- **Branch & Bound** - Mochila optimizada con poda

### Características Técnicas
- **Base de Datos**: Neo4j para almacenamiento de grafos
- **API REST**: Endpoints documentados para todos los algoritmos
- **DTOs optimizados** para integración con frontend (Leaflet.js)

## 📁 Estructura del Proyecto

```
src/main/java/com/example/minimaps/
├── domain/              # Entidades Neo4j
│   ├── Ciudad.java      # Nodo del grafo con coordenadas (lat, lng)
│   └── Ruta.java        # Relación entre ciudades con distancia
├── repository/          # Acceso a datos
│   └── CiudadRepository.java
├── service/             # Lógica de negocio
│   ├── GrafoService.java      # Algoritmos sobre grafos (BFS, DFS, Dijkstra, Prim, Kruskal)
│   └── AlgoritmosService.java # Algoritmos generales (Greedy, QuickSort, MergeSort, DP, etc.)
├── controller/          # API REST
│   ├── MapaController.java       # Endpoints de grafos
│   └── AlgoritmosController.java # Endpoints de algoritmos generales
├── dto/                 # Data Transfer Objects
│   ├── MapaResponse.java    # Mapa completo (nodos + aristas)
│   ├── EdgeDTO.java         # Arista del grafo
│   ├── RutaResponse.java    # Resultado de camino mínimo
│   └── Item.java            # Item para problema de la mochila
└── config/              # Configuración
    └── CorsConfig.java  # Configuración de CORS
```

## 🔧 Requisitos Previos

- **Java 21** o superior
- **Maven 3.8+**
- **Neo4j 5.x** (Desktop o Docker)

## 📦 Instalación de Neo4j

### Opción 1: Neo4j Desktop
1. Descargar desde: https://neo4j.com/download/
2. Crear nueva base de datos con nombre `minimaps`
3. Establecer contraseña (por defecto en el proyecto: `password`)
4. Iniciar la base de datos

### Opción 2: Docker
```bash
docker run \
  --name neo4j-minimaps \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

## ⚙️ Configuración

Editar `src/main/resources/application.properties`:

```properties
# Conexión a Neo4j
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=password

# Puerto del servidor
server.port=8080
```

## 🗺️ Cargar Datos de Ejemplo en Neo4j

Abrir Neo4j Browser (http://localhost:7474) y ejecutar:

```cypher
// Crear ciudades
CREATE (bsas:Ciudad {id: 'bsas', nombre: 'Buenos Aires', lat: -34.6037, lng: -58.3816})
CREATE (cordoba:Ciudad {id: 'cordoba', nombre: 'Córdoba', lat: -31.4201, lng: -64.1888})
CREATE (rosario:Ciudad {id: 'rosario', nombre: 'Rosario', lat: -32.9442, lng: -60.6505})
CREATE (mdq:Ciudad {id: 'mdq', nombre: 'Mar del Plata', lat: -38.0055, lng: -57.5426})
CREATE (mendoza:Ciudad {id: 'mendoza', nombre: 'Mendoza', lat: -32.8895, lng: -68.8458})

// Crear rutas (relaciones bidireccionales)
CREATE (bsas)-[:CONECTA_CON {distanciaKm: 400}]->(rosario)
CREATE (rosario)-[:CONECTA_CON {distanciaKm: 400}]->(bsas)

CREATE (bsas)-[:CONECTA_CON {distanciaKm: 700}]->(cordoba)
CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 700}]->(bsas)

CREATE (rosario)-[:CONECTA_CON {distanciaKm: 350}]->(cordoba)
CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 350}]->(rosario)

CREATE (bsas)-[:CONECTA_CON {distanciaKm: 404}]->(mdq)
CREATE (mdq)-[:CONECTA_CON {distanciaKm: 404}]->(bsas)

CREATE (cordoba)-[:CONECTA_CON {distanciaKm: 600}]->(mendoza)
CREATE (mendoza)-[:CONECTA_CON {distanciaKm: 600}]->(cordoba)

RETURN bsas, cordoba, rosario, mdq, mendoza
```

## 🏃 Ejecutar el Proyecto

```bash
# Desde la raíz del proyecto
./mvnw spring-boot:run

# O en Windows
mvnw.cmd spring-boot:run
```

El servidor estará disponible en: http://localhost:8080

## 📡 Endpoints de la API

### 🗺️ Algoritmos sobre Grafos

#### 1. Obtener Mapa Completo
```http
GET http://localhost:8080/api/mapa
```

**Respuesta:**
```json
{
  "nodes": [
    {
      "id": "bsas",
      "nombre": "Buenos Aires",
      "lat": -34.6037,
      "lng": -58.3816,
      "rutas": [...]
    }
  ],
  "edges": [
    {
      "origenId": "bsas",
      "destinoId": "rosario",
      "distanciaKm": 400.0
    }
  ]
}
```

#### 2. BFS (Búsqueda en Anchura)
```http
GET http://localhost:8080/api/mapa/bfs?origen=bsas
```
Explora el grafo por niveles desde el nodo origen.

#### 3. DFS (Búsqueda en Profundidad)
```http
GET http://localhost:8080/api/mapa/dfs?origen=bsas
```
Explora el grafo en profundidad usando un Stack.

#### 4. Dijkstra (Camino Mínimo)
```http
GET http://localhost:8080/api/mapa/dijkstra?origen=bsas&destino=mendoza
```

**Respuesta:**
```json
{
  "origen": "bsas",
  "destino": "mendoza",
  "distanciaTotalKm": 1300.0,
  "camino": [
    {"id": "bsas", "nombre": "Buenos Aires", ...},
    {"id": "cordoba", "nombre": "Córdoba", ...},
    {"id": "mendoza", "nombre": "Mendoza", ...}
  ]
}
```

#### 5. Prim (Árbol de Expansión Mínima)
```http
GET http://localhost:8080/api/mapa/prim
```
Calcula el MST usando PriorityQueue. Útil para encontrar la red de conexión de menor costo.

#### 6. Kruskal (Árbol de Expansión Mínima)
```http
GET http://localhost:8080/api/mapa/kruskal
```
Calcula el MST usando Union-Find para detectar ciclos.

---

### 🧮 Algoritmos Generales

#### 7. Greedy - Cambio de Monedas
```http
POST http://localhost:8080/api/algoritmos/greedy/cambio
Content-Type: application/json

{
  "monto": 87,
  "monedas": [50, 25, 10, 5, 1]
}
```

**Respuesta:**
```json
[50, 25, 10, 1, 1]
```

#### 8. QuickSort
```http
POST http://localhost:8080/api/algoritmos/quicksort
Content-Type: application/json

{
  "lista": [5, 2, 9, 1, 7, 6, 3]
}
```

**Respuesta:**
```json
[1, 2, 3, 5, 6, 7, 9]
```

#### 9. MergeSort
```http
POST http://localhost:8080/api/algoritmos/mergesort
Content-Type: application/json

{
  "lista": [5, 2, 9, 1, 7, 6, 3]
}
```

**Respuesta:**
```json
[1, 2, 3, 5, 6, 7, 9]
```

#### 10. Programación Dinámica - Mochila
```http
POST http://localhost:8080/api/algoritmos/mochila/dp
Content-Type: application/json

{
  "capacidad": 50,
  "items": [
    {"nombre": "Laptop", "peso": 10, "valor": 60},
    {"nombre": "Tablet", "peso": 20, "valor": 100},
    {"nombre": "Cámara", "peso": 30, "valor": 120}
  ]
}
```

**Respuesta:**
```json
220
```

#### 11. Backtracking - Subconjuntos
```http
POST http://localhost:8080/api/algoritmos/backtracking/subconjuntos
Content-Type: application/json

{
  "lista": [1, 2, 3]
}
```

**Respuesta:**
```json
[
  [],
  [1],
  [1, 2],
  [1, 2, 3],
  [1, 3],
  [2],
  [2, 3],
  [3]
]
```

#### 12. Branch & Bound - Mochila Optimizada
```http
POST http://localhost:8080/api/algoritmos/mochila/branch-bound
Content-Type: application/json

{
  "capacidad": 50,
  "items": [
    {"nombre": "Laptop", "peso": 10, "valor": 60},
    {"nombre": "Tablet", "peso": 20, "valor": 100},
    {"nombre": "Cámara", "peso": 30, "valor": 120}
  ]
}
```

**Respuesta:**
```json
220
```

## 🗺️ Integración con Frontend (Leaflet)

El formato de los DTOs está optimizado para Leaflet.js:

```javascript
// Ejemplo de consumo desde frontend
fetch('http://localhost:8080/api/mapa')
  .then(res => res.json())
  .then(data => {
    // data.nodes -> ciudades con lat/lng para marcadores
    // data.edges -> rutas para dibujar polylines
    
    data.nodes.forEach(ciudad => {
      L.marker([ciudad.lat, ciudad.lng])
        .bindPopup(ciudad.nombre)
        .addTo(map);
    });
    
    data.edges.forEach(edge => {
      const origen = data.nodes.find(n => n.id === edge.origenId);
      const destino = data.nodes.find(n => n.id === edge.destinoId);
      L.polyline([
        [origen.lat, origen.lng],
        [destino.lat, destino.lng]
      ], {color: 'blue'}).addTo(map);
    });
  });
```

## � Complejidad de los Algoritmos

| Algoritmo | Complejidad Temporal | Complejidad Espacial | Estructura de Datos |
|-----------|---------------------|---------------------|---------------------|
| **BFS** | O(V + E) | O(V) | Queue |
| **DFS** | O(V + E) | O(V) | Stack |
| **Dijkstra** | O((V + E) log V) | O(V) | PriorityQueue |
| **Prim** | O(E log V) | O(V) | PriorityQueue |
| **Kruskal** | O(E log E) | O(V) | Union-Find |
| **Greedy** | O(n) | O(n) | List |
| **QuickSort** | O(n log n) avg, O(n²) worst | O(log n) | In-place |
| **MergeSort** | O(n log n) | O(n) | Temporal arrays |
| **Mochila DP** | O(n × capacidad) | O(n × capacidad) | 2D array |
| **Backtracking** | O(2ⁿ) | O(n) | Recursión |
| **Branch & Bound** | O(2ⁿ) worst, mejor en práctica | O(n) | PriorityQueue |

## 📚 Recursos

- [Spring Data Neo4j](https://spring.io/projects/spring-data-neo4j)
- [Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Algoritmos de Grafos](https://en.wikipedia.org/wiki/Graph_traversal)
- [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

## 🧪 Testing

```bash
# Ejecutar tests
./mvnw test

# Compilar el proyecto
./mvnw clean package
```

### Ejemplos de Prueba con cURL

```bash
# BFS
curl "http://localhost:8080/api/mapa/bfs?origen=bsas"

# Dijkstra
curl "http://localhost:8080/api/mapa/dijkstra?origen=bsas&destino=mendoza"

# Greedy
curl -X POST "http://localhost:8080/api/algoritmos/greedy/cambio" \
  -H "Content-Type: application/json" \
  -d '{"monto": 87, "monedas": [50, 25, 10, 5, 1]}'

# QuickSort
curl -X POST "http://localhost:8080/api/algoritmos/quicksort" \
  -H "Content-Type: application/json" \
  -d '{"lista": [5, 2, 9, 1, 7, 6, 3]}'

# Mochila DP
curl -X POST "http://localhost:8080/api/algoritmos/mochila/dp" \
  -H "Content-Type: application/json" \
  -d '{"capacidad": 50, "items": [{"nombre":"Laptop","peso":10,"valor":60},{"nombre":"Tablet","peso":20,"valor":100}]}'
```

## 📝 Notas Técnicas

- **Grafos**: Las rutas en Neo4j son bidireccionales (requieren crear ambas direcciones)
- **Adjacency List**: El método `construirGrafo()` convierte el grafo Neo4j a memoria para mejor performance
- **CORS**: Habilitado para desarrollo local (`@CrossOrigin(origins = "*")`)
- **Lombok**: Reduce boilerplate en DTOs y entidades (requiere plugin en IDE)
- **Union-Find**: Implementado con compresión de caminos y unión por rango en Kruskal
- **Branch & Bound**: Usa relajación fraccional para calcular cotas superiores (bounds)

## ✅ Algoritmos Implementados

Todos los 11 algoritmos solicitados están **completamente implementados** y listos para usar:

### Algoritmos sobre Grafos ✅
- [x] BFS - Búsqueda en anchura
- [x] DFS - Búsqueda en profundidad  
- [x] Dijkstra - Camino mínimo
- [x] Prim - MST con PriorityQueue
- [x] Kruskal - MST con Union-Find

### Algoritmos Generales ✅
- [x] Greedy - Cambio de monedas
- [x] QuickSort - Divide y conquista
- [x] MergeSort - Divide y conquista
- [x] Programación Dinámica - Mochila 0/1
- [x] Backtracking - Generación de subconjuntos
- [x] Branch & Bound - Mochila optimizada

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es de uso educativo.

---

**Desarrollado con ❤️ usando Spring Boot + Neo4j**
