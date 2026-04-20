package edu.comillas.icai.gitt.pat.spring.practica3.entidad;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LineaCarritoTest {

    @Test
    void constructorCalculaCosteLineaArticulo() {
        Carrito carrito = new Carrito(5L, "persona@test.com");

        LineaCarrito linea = new LineaCarrito(carrito, 100L, 7.5, 4);

        assertEquals(30.0, linea.costeLineaArticulo);
    }

    @Test
    void actualizarCosteRecalculaConNuevosValores() {
        Carrito carrito = new Carrito(3L, "otro@test.com");
        LineaCarrito linea = new LineaCarrito(carrito, 200L, 10.0, 1);

        linea.precioUnitario = 12.0;
        linea.numeroUnidades = 3;
        linea.actualizarCoste();

        assertEquals(36.0, linea.costeLineaArticulo);
    }
}
