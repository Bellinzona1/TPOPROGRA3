# 📋 Guía Completa de Funcionalidades - Agendify Routes

## 🗺️ **PANEL DE CONTROL (SIDEBAR)**

---

## 1️⃣ **SELECCIÓN DE UBICACIONES**

### 📍 **Punto de Origen**
- **Funcionalidad:** Selecciona desde dónde quieres iniciar tu ruta
- **Opciones:**
  - Ciudades predefinidas de la base de datos Neo4j
  - Punto manual (haciendo clic en el mapa)
  - Ubicación actual del GPS

### 🎯 **Punto de Destino**
- **Funcionalidad:** Selecciona hacia dónde quieres llegar
- **Opciones:**
  - Ciudades predefinidas
  - Punto manual (haciendo clic en el mapa)

### 📌 **Usar Mi Ubicación Actual**
- **Funcionalidad:** Utiliza la API de Geolocalización del navegador para obtener tu posición GPS actual
- **Tecnología:** `navigator.geolocation.getCurrentPosition()`
- **Uso:** Click en el botón → Acepta permisos → Se establece automáticamente como origen

---

## 2️⃣ **ALGORITMO PRINCIPAL DE RUTAS**

### 🧭 **Calcular Ruta Óptima (Dijkstra)**

#### **¿Qué hace?**
Calcula el camino más corto entre dos ciudades considerando las distancias reales en kilómetros.

#### **Algoritmo utilizado: DIJKSTRA**
**Descripción:**
- Algoritmo de búsqueda de camino mínimo en grafos ponderados
- Explora nodos vecinos seleccionando siempre el de menor distancia acumulada
- Garantiza encontrar el camino más corto si todos los pesos son no negativos

**Complejidad computacional:**
```
⏱️ O((V + E) log V)

Donde:
- V = número de vértices (ciudades) = 11 ciudades
- E = número de aristas (rutas) = ~32 rutas bidireccionales

En este proyecto:
- O((11 + 32) log 11) ≈ O(43 × 3.46) ≈ O(149) operaciones
```

**¿Por qué es eficiente?**
- Usa una cola de prioridad (heap) para seleccionar el nodo con menor distancia
- Evita recalcular distancias ya optimizadas
- Ideal para encontrar rutas en mapas de navegación

**Resultado:**
- ✅ Muestra la ruta trazada en el mapa con calles reales (OSRM)
- ✅ Panel de navegación con instrucciones turn-by-turn
- ✅ Distancia total y tiempo estimado
- ✅ Guía por voz sincronizada

---

## 3️⃣ **ALGORITMOS DE GRAFOS**

### 🌳 **BFS (Breadth-First Search)**

#### **¿Qué hace?**
Explora el grafo de ciudades **por niveles** desde una ciudad origen.

#### **Funcionamiento:**
1. Comienza en la ciudad origen
2. Visita todos los vecinos directos (nivel 1)
3. Luego visita los vecinos de los vecinos (nivel 2)
4. Continúa hasta explorar todo el grafo

**Complejidad computacional:**
```
⏱️ O(V + E)

Donde:
- V = número de ciudades = 11
- E = número de rutas = 32

En este proyecto:
- O(11 + 32) = O(43) operaciones
```

**¿Para qué sirve?**
- ✅ Encontrar la ciudad más cercana (en número de conexiones/saltos)
- ✅ Ver qué ciudades están conectadas desde un punto
- ✅ Análisis de alcance y cobertura
- ✅ Detectar si una ciudad es alcanzable desde otra

**Ejemplo:**
```
Origen: Buenos Aires
Resultado: [Buenos Aires, Rosario, Córdoba, Mar del Plata, Corrientes, Chubut, ...]
```

---

### 🔍 **DFS (Depth-First Search)**

#### **¿Qué hace?**
Explora el grafo **yendo lo más profundo posible** antes de retroceder.

#### **Funcionamiento:**
1. Comienza en la ciudad origen
2. Explora una ruta completa hasta el final
3. Retrocede y explora otras ramas
4. Usa backtracking para cubrir todo el grafo

**Complejidad computacional:**
```
⏱️ O(V + E)

En este proyecto:
- O(11 + 32) = O(43) operaciones
```

**¿Para qué sirve?**
- ✅ Detectar ciclos en el grafo
- ✅ Encontrar caminos (no necesariamente el más corto)
- ✅ Exploración exhaustiva
- ✅ Análisis de conectividad

**Diferencia con BFS:**
- **BFS:** Explora por capas (primero todos los vecinos)
- **DFS:** Explora por profundidad (una rama completa primero)

---

### 🌲 **PRIM (Minimum Spanning Tree)**

#### **¿Qué hace?**
Encuentra un conjunto mínimo de rutas que conecta **todas las ciudades** con la menor distancia total posible, sin formar ciclos.

#### **Funcionamiento:**
1. Comienza con una ciudad cualquiera
2. Agrega la arista de menor peso que conecte con una ciudad no visitada
3. Repite hasta incluir todas las ciudades
4. Resultado: un árbol (grafo sin ciclos)

**Complejidad computacional:**
```
⏱️ O(E log V)

Donde:
- E = número de aristas = 32
- V = número de vértices = 11

En este proyecto:
- O(32 log 11) ≈ O(32 × 3.46) ≈ O(111) operaciones
```

**¿Para qué sirve?**
- ✅ Diseño de redes de telecomunicaciones
- ✅ Minimizar costos de infraestructura (carreteras, cables)
- ✅ Planificación urbana
- ✅ Optimización de rutas de distribución

**Ejemplo de resultado:**
```
Total de rutas originales: 32
Rutas necesarias (MST): 10 (n-1 rutas para n ciudades)
Distancia total minimizada: ~4,500 km
```

---

### 🌿 **KRUSKAL (Minimum Spanning Tree)**

#### **¿Qué hace?**
Lo mismo que Prim (MST), pero con un **algoritmo diferente**.

#### **Funcionamiento:**
1. Ordena TODAS las rutas por distancia (menor a mayor)
2. Agrega rutas en orden, evitando formar ciclos
3. Usa "Union-Find" para detectar ciclos eficientemente
4. Termina cuando tiene n-1 aristas

**Complejidad computacional:**
```
⏱️ O(E log E)

En este proyecto:
- O(32 log 32) ≈ O(32 × 5) ≈ O(160) operaciones
```

**Diferencia con Prim:**
- **Prim:** Construye el árbol desde un nodo, agregando aristas conectadas
- **Kruskal:** Ordena todas las aristas y las agrega globalmente

**¿Cuándo usar cada uno?**
- **Prim:** Mejor si el grafo es denso (muchas conexiones)
- **Kruskal:** Mejor si el grafo es disperso (pocas conexiones)

---

## 4️⃣ **HERRAMIENTAS DE OPTIMIZACIÓN**

### 📊 **Ordenar Ciudades (QuickSort)**

#### **¿Qué hace?**
Calcula la distancia desde tu punto de origen a todas las ciudades y las ordena de más cercana a más lejana.

#### **Algoritmo utilizado: QUICKSORT**
**Descripción:**
- Algoritmo de ordenamiento por "divide y conquista"
- Elige un pivote y particiona el array en menores y mayores
- Ordena recursivamente cada partición

**Complejidad computacional:**
```
⏱️ Caso promedio: O(n log n)
⏱️ Peor caso: O(n²)

Donde n = número de ciudades = 11

En este proyecto:
- Promedio: O(11 log 11) ≈ O(11 × 3.46) ≈ O(38) comparaciones
- Peor caso: O(11²) = O(121) comparaciones
```

**¿Para qué sirve?**
- ✅ Identificar las sucursales más cercanas
- ✅ Planificar visitas en orden de proximidad
- ✅ Optimizar rutas de logística

**Ejemplo de resultado:**
```
🎯 CIUDADES ORDENADAS POR DISTANCIA
Origen: Buenos Aires

Rosario: 30.0 km
Córdoba: 70.0 km
Mar del Plata: 40.4 km
Corrientes: 104.0 km
...
```

---

### ⚡ **Comparar QuickSort vs MergeSort**

#### **¿Qué hace?**
Ordena las mismas ciudades con DOS algoritmos diferentes y mide el tiempo de ejecución para compararlos.

#### **Algoritmos comparados:**

**1. QUICKSORT**
```
⏱️ O(n log n) promedio
✅ Muy rápido en la práctica
❌ Peor caso O(n²) si pivote mal elegido
✅ Ordenamiento in-place (no usa memoria extra)
```

**2. MERGESORT**
```
⏱️ O(n log n) GARANTIZADO (siempre)
✅ Estable (mantiene orden relativo de elementos iguales)
❌ Usa O(n) memoria extra
✅ Predecible, nunca degrada
```

**Complejidad computacional:**
```
Ambos: O(n log n) en promedio

En este proyecto (11 ciudades):
- O(11 log 11) ≈ O(38) operaciones
```

**Resultado esperado:**
```
⚡ COMPARACIÓN DE ALGORITMOS
Dataset: 11 ciudades

🔵 QuickSort:
   Tiempo: 2.34 ms
   Complejidad: O(n log n) promedio

🟢 MergeSort:
   Tiempo: 3.12 ms
   Complejidad: O(n log n) garantizado

🏆 Ganador: QuickSort 🔵
```

**¿Por qué QuickSort suele ganar?**
- Mejor uso de caché del CPU
- Menos operaciones de memoria
- Constantes más pequeñas en la práctica

---

### 💰 **Calcular Cambio de Peajes (Greedy)**

#### **¿Qué hace?**
Simula el pago de peajes en tu ruta y calcula el cambio óptimo usando la menor cantidad de monedas.

#### **Algoritmo utilizado: GREEDY (Voraz)**
**Descripción:**
- Toma decisiones localmente óptimas en cada paso
- Siempre elige la moneda más grande que quepa en el monto restante
- No recalcula decisiones pasadas

**Complejidad computacional:**
```
⏱️ O(n)

Donde n = número de tipos de monedas = 6

En este proyecto:
- O(6) operaciones (muy rápido)
```

**Funcionamiento:**
```javascript
Distancia ruta: 350 km
Costo peaje: $175 (a $0.50/km)
Pagas con: $200
Cambio a devolver: $25

Algoritmo Greedy:
1. ¿Cabe $100? No (25 < 100)
2. ¿Cabe $50? No
3. ¿Cabe $20? Sí → Tomar $20, quedan $5
4. ¿Cabe $10? No
5. ¿Cabe $5? Sí → Tomar $5, quedan $0

Resultado: 1 x $20 + 1 x $5 = 2 monedas
```

**¿Para qué sirve?**
- ✅ Cajeros automáticos
- ✅ Sistemas de punto de venta
- ✅ Optimización de cambio en comercios
- ✅ Planificación de efectivo para viajes

**¿Siempre funciona?**
- ✅ Sí, para sistemas de monedas "canónicas" (como el peso argentino)
- ❌ No garantizado para sistemas arbitrarios de monedas

---

### 🔄 **Combinar Paradas (Backtracking)**

#### **¿Qué hace?**
Genera **todas las combinaciones posibles** de paradas que puedes hacer con las primeras 4 ciudades.

#### **Algoritmo utilizado: BACKTRACKING**
**Descripción:**
- Exploración exhaustiva de todas las soluciones
- Para cada ciudad: decide si incluirla o no
- Genera el árbol completo de decisiones
- Retrocede cuando completa una rama

**Complejidad computacional:**
```
⏱️ O(2^n)

Donde n = número de elementos = 4 ciudades

En este proyecto:
- O(2^4) = O(16) subconjuntos generados
```

**¿Por qué 2^n?**
Para cada ciudad tienes 2 opciones: incluirla o no
- 4 ciudades → 2 × 2 × 2 × 2 = 16 combinaciones

**Ejemplo de resultado:**
```
🔄 COMBINACIONES DE PARADAS
Ciudades base: Buenos Aires, Córdoba, Rosario, Mendoza
Total de combinaciones: 16

📋 Rutas posibles (top 10):
Buenos Aires
Córdoba
Rosario
Mendoza
Buenos Aires → Córdoba
Buenos Aires → Rosario
Buenos Aires → Mendoza
Córdoba → Rosario
Córdoba → Mendoza
Rosario → Mendoza
```

**¿Para qué sirve?**
- ✅ Planificar rutas multi-parada
- ✅ Generar opciones de viaje
- ✅ Análisis combinatorio de entregas
- ✅ Explorar todas las posibilidades

**Advertencia:**
- Con muchas ciudades explota exponencialmente
- 10 ciudades = 1,024 combinaciones
- 20 ciudades = 1,048,576 combinaciones (¡imposible!)

---

## 5️⃣ **NAVEGACIÓN Y VOZ**

### 🔊 **Guía por Voz**

#### **¿Qué hace?**
Lee en voz alta las instrucciones de navegación paso a paso, sincronizadas con el panel de navegación.

#### **Tecnología:** Web Speech API
```javascript
speechSynthesis.speak(utterance)
```

**Características:**
- ✅ Voz en español
- ✅ Lee solo la instrucción actual (no todas juntas)
- ✅ Se sincroniza con los botones "Anterior" y "Siguiente"
- ✅ Se puede activar/desactivar con un toggle

**Ejemplo de lectura:**
```
"Gira a la derecha en Avenida Corrientes, en 250 metros"
"Continúa recto por Autopista 25 de Mayo, en 3.5 kilómetros"
"Has llegado a tu destino"
```

---

## 📊 **RESUMEN DE COMPLEJIDADES**

| Algoritmo | Complejidad | Operaciones (11 ciudades) | Tipo |
|-----------|-------------|---------------------------|------|
| **BFS** | O(V + E) | ~43 | Búsqueda en grafos |
| **DFS** | O(V + E) | ~43 | Búsqueda en grafos |
| **Dijkstra** | O((V+E) log V) | ~149 | Camino mínimo |
| **Prim** | O(E log V) | ~111 | MST |
| **Kruskal** | O(E log E) | ~160 | MST |
| **QuickSort** | O(n log n) | ~38 (promedio) | Ordenamiento |
| **MergeSort** | O(n log n) | ~38 (garantizado) | Ordenamiento |
| **Greedy** | O(n) | ~6 | Optimización |
| **Backtracking** | O(2^n) | 16 (con 4 ciudades) | Combinatoria |

---

## 🎯 **CASOS DE USO PRÁCTICOS**

### **Logística y Distribución**
- Usar **Dijkstra** para encontrar la ruta más corta entre almacenes
- Usar **Prim/Kruskal** para diseñar la red óptima de distribución
- Usar **Ordenar Ciudades** para priorizar entregas

### **Análisis de Cobertura**
- Usar **BFS** para ver qué ciudades están a 1-2 conexiones de distancia
- Usar **DFS** para explorar toda la red de rutas disponibles

### **Planificación de Viajes**
- Usar **Dijkstra + OSRM** para navegación turn-by-turn
- Usar **Combinar Paradas** para generar itinerarios multi-ciudad
- Usar **Guía por Voz** para navegación manos libres

### **Optimización de Costos**
- Usar **Calcular Peajes** para estimar gastos de viaje
- Usar **Prim/Kruskal** para minimizar infraestructura de red

---

## 🚀 **TECNOLOGÍAS UTILIZADAS**

- **Backend:** Spring Boot 3.5.7 + Java 17 + Neo4j 5.x
- **Frontend:** React 18.3.1 + Vite + Tailwind CSS
- **Mapas:** Leaflet 4.2.1 + OSRM (Open Source Routing Machine)
- **Navegación:** Web Speech API + Geolocation API
- **Base de datos:** Neo4j (grafo de 11 ciudades, 32 rutas)

---

## 📝 **NOTAS IMPORTANTES**

1. **Puntos manuales:** Los algoritmos de grafo (BFS, DFS, Prim, Kruskal) solo funcionan con ciudades predefinidas, no con puntos manuales.

2. **OSRM vs Dijkstra:** 
   - **Dijkstra** calcula sobre el grafo de Neo4j (distancias directas entre ciudades)
   - **OSRM** calcula sobre calles reales (más preciso para navegación)

3. **Rendimiento:** Con solo 11 ciudades, todos los algoritmos son instantáneos. En grafos más grandes (1000+ nodos), las diferencias de complejidad serían más notorias.

---

**¿Tienes preguntas sobre algún algoritmo específico?** 🤔
