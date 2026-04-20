package edu.comillas.icai.gitt.pat.spring.practica3.servicio;

import edu.comillas.icai.gitt.pat.spring.practica3.entidad.Carrito;
import edu.comillas.icai.gitt.pat.spring.practica3.entidad.LineaCarrito;
import edu.comillas.icai.gitt.pat.spring.practica3.repositorio.CarritoRepository;
import edu.comillas.icai.gitt.pat.spring.practica3.repositorio.LineaCarritoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarritoServiceTest {

    @Mock
    private CarritoRepository carritoRepository;

    @Mock
    private LineaCarritoRepository lineaCarritoRepository;

    @InjectMocks
    private CarritoService carritoService;

    @Test
    void crearInicializaTotalAPrecioCero() {
        Carrito carrito = new Carrito(7L, "usuario@test.com");
        carrito.totalPrecio = 99.0;

        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Carrito creado = carritoService.crear(carrito);

        assertEquals(0.0, creado.totalPrecio);
        verify(carritoRepository).save(carrito);
    }

    @Test
    void actualizarMantieneElTotalCalculadoDelCarrito() {
        Carrito carritoExistente = new Carrito(7L, "antes@test.com");
        carritoExistente.idCarrito = 4L;
        carritoExistente.totalPrecio = 45.0;

        Carrito carritoActualizado = new Carrito(9L, "despues@test.com");
        carritoActualizado.totalPrecio = 999.0;

        when(carritoRepository.findById(4L)).thenReturn(Optional.of(carritoExistente));
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Carrito resultado = carritoService.actualizar(4L, carritoActualizado);

        assertNotNull(resultado);
        assertEquals(9L, resultado.idUsuario);
        assertEquals("despues@test.com", resultado.correoUsuario);
        assertEquals(45.0, resultado.totalPrecio);
    }

    @Test
    void anadirLineaCarritoGuardaLineaYActualizaTotal() {
        Long idCarrito = 1L;
        Carrito carrito = new Carrito(10L, "mail@test.com");
        carrito.idCarrito = idCarrito;

        LineaCarrito linea = new LineaCarrito(carrito, 50L, 12.0, 2);

        when(carritoRepository.findById(idCarrito)).thenReturn(Optional.of(carrito));
        when(lineaCarritoRepository.save(any(LineaCarrito.class))).thenReturn(linea);
        when(lineaCarritoRepository.findByCarritoIdCarrito(idCarrito)).thenReturn(Collections.singletonList(linea));
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LineaCarrito resultado = carritoService.anadirLineaCarrito(idCarrito, 50L, 12.0, 2);

        assertNotNull(resultado);
        assertEquals(24.0, carrito.totalPrecio);
        verify(lineaCarritoRepository).save(any(LineaCarrito.class));
        verify(carritoRepository, atLeastOnce()).save(any(Carrito.class));
    }

    @Test
    void actualizarLineaCarritoRecalculaCoste() {
        Long idLinea = 22L;
        Carrito carrito = new Carrito(11L, "mail@test.com");
        carrito.idCarrito = 3L;

        LineaCarrito lineaExistente = new LineaCarrito(carrito, 90L, 5.0, 2);
        lineaExistente.idLineaCarrito = idLinea;

        when(lineaCarritoRepository.findById(idLinea)).thenReturn(Optional.of(lineaExistente));
        when(lineaCarritoRepository.save(any(LineaCarrito.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(carritoRepository.findById(3L)).thenReturn(Optional.of(carrito));
        when(lineaCarritoRepository.findByCarritoIdCarrito(3L)).thenReturn(Collections.singletonList(lineaExistente));
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LineaCarrito actualizada = carritoService.actualizarLineaCarrito(idLinea, 3);

        assertNotNull(actualizada);
        assertEquals(3, actualizada.numeroUnidades);
        assertEquals(15.0, actualizada.costeLineaArticulo);
    }

    @Test
    void eliminarLineaCarritoExistenteBorraYActualizaTotal() {
        Long idCarrito = 8L;
        Long idLinea = 99L;
        Carrito carrito = new Carrito(2L, "u@test.com");
        carrito.idCarrito = idCarrito;

        LineaCarrito linea = new LineaCarrito(carrito, 13L, 2.0, 4);
        linea.idLineaCarrito = idLinea;

        when(lineaCarritoRepository.findById(idLinea)).thenReturn(Optional.of(linea));
        when(carritoRepository.findById(idCarrito)).thenReturn(Optional.of(carrito));
        when(lineaCarritoRepository.findByCarritoIdCarrito(idCarrito)).thenReturn(Collections.emptyList());
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        carritoService.eliminarLineaCarrito(idLinea);

        verify(lineaCarritoRepository).deleteById(idLinea);
        ArgumentCaptor<Carrito> carritoCaptor = ArgumentCaptor.forClass(Carrito.class);
        verify(carritoRepository, atLeastOnce()).save(carritoCaptor.capture());
        Carrito ultimoGuardado = carritoCaptor.getValue();
        assertEquals(0.0, ultimoGuardado.totalPrecio);
    }

    @Test
    void anadirLineaCarritoDevuelveNullSiNoExisteCarrito() {
        when(carritoRepository.findById(123L)).thenReturn(Optional.empty());

        LineaCarrito resultado = carritoService.anadirLineaCarrito(123L, 1L, 10.0, 1);

        assertNull(resultado);
        verify(lineaCarritoRepository, never()).save(any());
        verify(carritoRepository, never()).save(any());
        verify(lineaCarritoRepository, never()).findByCarritoIdCarrito(any());
    }
}
