package com.example.minimaps.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa un item para el problema de la mochila.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    
    private String nombre;
    
    private int peso;
    
    private int valor;
}
