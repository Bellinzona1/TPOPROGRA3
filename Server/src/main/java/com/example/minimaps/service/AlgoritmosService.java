package com.example.minimaps.service;

import com.example.minimaps.dto.Item;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio que implementa algoritmos generales de programación:
 * - Greedy
 * - Divide y Conquista (QuickSort, MergeSort)
 * - Programación Dinámica
 * - Backtracking
 * - Branch & Bound
 */
@Service
public class AlgoritmosService {
    
    /**
     * ALGORITMO GREEDY: Problema del cambio de monedas.
     * 
     * Estrategia: Seleccionar siempre la moneda de mayor valor que no exceda el monto restante.
     * 
     * Complejidad: O(n) donde n es el número de tipos de monedas
     * 
     * @param monto Cantidad a devolver en cambio
     * @param monedas Lista de denominaciones disponibles (debe estar ordenada descendente)
     * @return Lista de monedas utilizadas en el cambio
     */
    public List<Integer> greedyCambio(int monto, List<Integer> monedas) {
        List<Integer> resultado = new ArrayList<>();
        
        // Ordenar monedas en orden descendente
        List<Integer> monedasOrdenadas = new ArrayList<>(monedas);
        monedasOrdenadas.sort(Collections.reverseOrder());
        
        int montoRestante = monto;
        
        // Estrategia greedy: tomar siempre la moneda más grande posible
        for (int moneda : monedasOrdenadas) {
            while (montoRestante >= moneda) {
                resultado.add(moneda);
                montoRestante -= moneda;
            }
        }
        
        return resultado;
    }
    
    /**
     * ALGORITMO QUICKSORT: Ordenamiento por división y conquista.
     * 
     * Estrategia: Elegir un pivote, particionar el arreglo en menores y mayores,
     * y ordenar recursivamente cada partición.
     * 
     * Complejidad: O(n log n) promedio, O(n²) peor caso
     * 
     * @param lista Lista a ordenar
     * @return Lista ordenada
     */
    public List<Integer> quicksort(List<Integer> lista) {
        if (lista.size() <= 1) {
            return new ArrayList<>(lista);
        }
        
        List<Integer> resultado = new ArrayList<>(lista);
        quicksortHelper(resultado, 0, resultado.size() - 1);
        return resultado;
    }
    
    /**
     * Método auxiliar recursivo para QuickSort.
     */
    private void quicksortHelper(List<Integer> lista, int inicio, int fin) {
        if (inicio < fin) {
            // Particionar y obtener índice del pivote
            int indicePivote = particionar(lista, inicio, fin);
            
            // Ordenar recursivamente las dos mitades
            quicksortHelper(lista, inicio, indicePivote - 1);
            quicksortHelper(lista, indicePivote + 1, fin);
        }
    }
    
    /**
     * Particiona el arreglo usando el último elemento como pivote.
     */
    private int particionar(List<Integer> lista, int inicio, int fin) {
        int pivote = lista.get(fin);
        int i = inicio - 1;
        
        for (int j = inicio; j < fin; j++) {
            if (lista.get(j) <= pivote) {
                i++;
                // Intercambiar lista[i] y lista[j]
                int temp = lista.get(i);
                lista.set(i, lista.get(j));
                lista.set(j, temp);
            }
        }
        
        // Intercambiar lista[i+1] y lista[fin] (pivote)
        int temp = lista.get(i + 1);
        lista.set(i + 1, lista.get(fin));
        lista.set(fin, temp);
        
        return i + 1;
    }
    
    /**
     * ALGORITMO MERGESORT: Ordenamiento por división y conquista.
     * 
     * Estrategia: Dividir el arreglo a la mitad recursivamente hasta tener subarreglos
     * de tamaño 1, luego combinarlos en orden.
     * 
     * Complejidad: O(n log n) en todos los casos
     * 
     * @param lista Lista a ordenar
     * @return Lista ordenada
     */
    public List<Integer> mergesort(List<Integer> lista) {
        if (lista.size() <= 1) {
            return new ArrayList<>(lista);
        }
        
        List<Integer> resultado = new ArrayList<>(lista);
        mergesortHelper(resultado, 0, resultado.size() - 1);
        return resultado;
    }
    
    /**
     * Método auxiliar recursivo para MergeSort.
     */
    private void mergesortHelper(List<Integer> lista, int inicio, int fin) {
        if (inicio < fin) {
            int medio = inicio + (fin - inicio) / 2;
            
            // Ordenar primera y segunda mitad
            mergesortHelper(lista, inicio, medio);
            mergesortHelper(lista, medio + 1, fin);
            
            // Combinar las mitades ordenadas
            merge(lista, inicio, medio, fin);
        }
    }
    
    /**
     * Combina dos subarreglos ordenados.
     */
    private void merge(List<Integer> lista, int inicio, int medio, int fin) {
        // Crear arreglos temporales
        List<Integer> izquierda = new ArrayList<>(lista.subList(inicio, medio + 1));
        List<Integer> derecha = new ArrayList<>(lista.subList(medio + 1, fin + 1));
        
        int i = 0, j = 0, k = inicio;
        
        // Combinar los arreglos temporales
        while (i < izquierda.size() && j < derecha.size()) {
            if (izquierda.get(i) <= derecha.get(j)) {
                lista.set(k++, izquierda.get(i++));
            } else {
                lista.set(k++, derecha.get(j++));
            }
        }
        
        // Copiar elementos restantes de izquierda
        while (i < izquierda.size()) {
            lista.set(k++, izquierda.get(i++));
        }
        
        // Copiar elementos restantes de derecha
        while (j < derecha.size()) {
            lista.set(k++, derecha.get(j++));
        }
    }
    
    /**
     * PROGRAMACIÓN DINÁMICA: Problema de la mochila (0/1 Knapsack).
     * 
     * Estrategia: Construir una tabla DP donde dp[i][w] representa el valor máximo
     * que se puede obtener con los primeros i items y capacidad w.
     * 
     * Complejidad: O(n * capacidad) donde n es el número de items
     * 
     * @param capacidad Capacidad máxima de la mochila
     * @param items Lista de items disponibles
     * @return Valor máximo que se puede obtener
     */
    public int mochilaDP(int capacidad, List<Item> items) {
        int n = items.size();
        
        // Tabla DP: dp[i][w] = valor máximo con primeros i items y capacidad w
        int[][] dp = new int[n + 1][capacidad + 1];
        
        // Llenar la tabla de abajo hacia arriba
        for (int i = 1; i <= n; i++) {
            Item item = items.get(i - 1);
            
            for (int w = 0; w <= capacidad; w++) {
                // Opción 1: No tomar el item actual
                dp[i][w] = dp[i - 1][w];
                
                // Opción 2: Tomar el item actual (si cabe)
                if (item.getPeso() <= w) {
                    int valorConItem = dp[i - 1][w - item.getPeso()] + item.getValor();
                    dp[i][w] = Math.max(dp[i][w], valorConItem);
                }
            }
        }
        
        return dp[n][capacidad];
    }
    
    /**
     * BACKTRACKING: Generar todos los subconjuntos de un conjunto.
     * 
     * Estrategia: Para cada elemento, decidir si incluirlo o no en el subconjunto actual.
     * Explorar ambas opciones recursivamente.
     * 
     * Complejidad: O(2^n) donde n es el tamaño del conjunto
     * 
     * @param nums Lista de números
     * @return Lista de todos los subconjuntos posibles
     */
    public List<List<Integer>> subconjuntosBacktracking(List<Integer> nums) {
        List<List<Integer>> resultado = new ArrayList<>();
        List<Integer> subconjuntoActual = new ArrayList<>();
        
        backtrackSubconjuntos(nums, 0, subconjuntoActual, resultado);
        
        return resultado;
    }
    
    /**
     * Método auxiliar recursivo para generar subconjuntos.
     */
    private void backtrackSubconjuntos(List<Integer> nums, int inicio, 
                                       List<Integer> actual, List<List<Integer>> resultado) {
        // Agregar el subconjunto actual al resultado
        resultado.add(new ArrayList<>(actual));
        
        // Explorar todas las opciones desde la posición actual
        for (int i = inicio; i < nums.size(); i++) {
            // Incluir nums[i] en el subconjunto actual
            actual.add(nums.get(i));
            
            // Recursión con el siguiente índice
            backtrackSubconjuntos(nums, i + 1, actual, resultado);
            
            // Backtrack: remover el último elemento agregado
            actual.remove(actual.size() - 1);
        }
    }
    
    /**
     * BRANCH & BOUND: Problema de la mochila (versión optimizada).
     * 
     * Estrategia: Explorar el árbol de decisiones podando ramas que no pueden
     * mejorar la mejor solución encontrada hasta el momento.
     * Usa una cota superior (bound) para decidir si vale la pena explorar una rama.
     * 
     * Complejidad: O(2^n) peor caso, pero mucho mejor en práctica gracias a la poda
     * 
     * @param capacidad Capacidad máxima de la mochila
     * @param items Lista de items disponibles (debe estar ordenada por valor/peso descendente)
     * @return Valor máximo que se puede obtener
     */
    public int mochilaBranchBound(int capacidad, List<Item> items) {
        // Ordenar items por ratio valor/peso (descendente) para mejor poda
        List<Item> itemsOrdenados = new ArrayList<>(items);
        itemsOrdenados.sort((a, b) -> {
            double ratioA = (double) a.getValor() / a.getPeso();
            double ratioB = (double) b.getValor() / b.getPeso();
            return Double.compare(ratioB, ratioA);
        });
        
        // Cola de prioridad para explorar nodos más prometedores primero
        PriorityQueue<NodoMochila> pq = new PriorityQueue<>();
        
        // Nodo raíz (sin items incluidos)
        NodoMochila raiz = new NodoMochila(0, 0, 0, 0);
        raiz.bound = calcularBound(raiz, capacidad, itemsOrdenados);
        
        pq.offer(raiz);
        int mejorValor = 0;
        
        while (!pq.isEmpty()) {
            NodoMochila actual = pq.poll();
            
            // Si el bound de este nodo no puede mejorar la mejor solución, podar
            if (actual.bound <= mejorValor) {
                continue;
            }
            
            // Si ya procesamos todos los items
            if (actual.nivel >= itemsOrdenados.size()) {
                continue;
            }
            
            Item item = itemsOrdenados.get(actual.nivel);
            
            // RAMA IZQUIERDA: Incluir el item actual
            if (actual.peso + item.getPeso() <= capacidad) {
                NodoMochila incluir = new NodoMochila(
                    actual.nivel + 1,
                    actual.valor + item.getValor(),
                    actual.peso + item.getPeso(),
                    0
                );
                incluir.bound = calcularBound(incluir, capacidad, itemsOrdenados);
                
                // Actualizar mejor valor si es necesario
                if (incluir.valor > mejorValor) {
                    mejorValor = incluir.valor;
                }
                
                // Solo explorar si el bound es prometedor
                if (incluir.bound > mejorValor) {
                    pq.offer(incluir);
                }
            }
            
            // RAMA DERECHA: No incluir el item actual
            NodoMochila noIncluir = new NodoMochila(
                actual.nivel + 1,
                actual.valor,
                actual.peso,
                0
            );
            noIncluir.bound = calcularBound(noIncluir, capacidad, itemsOrdenados);
            
            // Solo explorar si el bound es prometedor
            if (noIncluir.bound > mejorValor) {
                pq.offer(noIncluir);
            }
        }
        
        return mejorValor;
    }
    
    /**
     * Calcula la cota superior (bound) para un nodo en Branch & Bound.
     * Usa relajación fraccional: permite tomar fracciones de items.
     */
    private double calcularBound(NodoMochila nodo, int capacidad, List<Item> items) {
        if (nodo.peso >= capacidad) {
            return 0;
        }
        
        double bound = nodo.valor;
        int pesoRestante = capacidad - nodo.peso;
        int nivel = nodo.nivel;
        
        // Agregar items completos mientras quepan
        while (nivel < items.size() && items.get(nivel).getPeso() <= pesoRestante) {
            bound += items.get(nivel).getValor();
            pesoRestante -= items.get(nivel).getPeso();
            nivel++;
        }
        
        // Agregar fracción del siguiente item (relajación)
        if (nivel < items.size()) {
            bound += (double) pesoRestante / items.get(nivel).getPeso() 
                     * items.get(nivel).getValor();
        }
        
        return bound;
    }
    
    /**
     * Clase auxiliar para representar un nodo en el árbol de Branch & Bound.
     * Implementa Comparable para usar en PriorityQueue (mayor bound = mayor prioridad).
     */
    private static class NodoMochila implements Comparable<NodoMochila> {
        int nivel;      // Nivel en el árbol (índice del item actual)
        int valor;      // Valor acumulado
        int peso;       // Peso acumulado
        double bound;   // Cota superior del valor posible desde este nodo
        
        NodoMochila(int nivel, int valor, int peso, double bound) {
            this.nivel = nivel;
            this.valor = valor;
            this.peso = peso;
            this.bound = bound;
        }
        
        @Override
        public int compareTo(NodoMochila otro) {
            // Mayor bound tiene mayor prioridad
            return Double.compare(otro.bound, this.bound);
        }
    }
}
