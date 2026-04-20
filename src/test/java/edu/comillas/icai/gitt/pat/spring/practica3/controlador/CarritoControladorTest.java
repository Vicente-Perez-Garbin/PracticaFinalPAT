package edu.comillas.icai.gitt.pat.spring.practica3.controlador;
import edu.comillas.icai.gitt.pat.spring.practica3.entidad.Carrito;
import edu.comillas.icai.gitt.pat.spring.practica3.entidad.LineaCarrito;
import edu.comillas.icai.gitt.pat.spring.practica3.servicio.CarritoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CarritoControladorTest {

    @Mock
    private CarritoService carritoService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new CarritoControlador(carritoService)).build();
    }

    @Test
    void creaCarritoRecibeRequestDtoYDevuelveResponseDto() throws Exception {
        Carrito carritoGuardado = new Carrito(7L, "usuario@test.com");
        carritoGuardado.idCarrito = 1L;
        carritoGuardado.totalPrecio = 0.0;

        when(carritoService.crear(any(Carrito.class))).thenReturn(carritoGuardado);

        mockMvc.perform(post("/api/carrito")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"idUsuario\": 7,
                                  \"correoUsuario\": \"usuario@test.com\"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idCarrito").value(1))
                .andExpect(jsonPath("$.idUsuario").value(7))
                .andExpect(jsonPath("$.correoUsuario").value("usuario@test.com"))
                .andExpect(jsonPath("$.totalPrecio").value(0.0))
                .andExpect(jsonPath("$.lineasCarrito").doesNotExist());

        ArgumentCaptor<Carrito> carritoCaptor = ArgumentCaptor.forClass(Carrito.class);
        verify(carritoService).crear(carritoCaptor.capture());
        assertEquals(7L, carritoCaptor.getValue().idUsuario);
        assertEquals("usuario@test.com", carritoCaptor.getValue().correoUsuario);
    }

    @Test
    void getCarritosDevuelveListaDeResponseDtos() throws Exception {
        Carrito carrito = new Carrito(5L, "lista@test.com");
        carrito.idCarrito = 10L;
        carrito.totalPrecio = 25.0;

        when(carritoService.obtenerTodos()).thenReturn(List.of(carrito));

        mockMvc.perform(get("/api/carrito"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idCarrito").value(10))
                .andExpect(jsonPath("$[0].idUsuario").value(5))
                .andExpect(jsonPath("$[0].correoUsuario").value("lista@test.com"))
                .andExpect(jsonPath("$[0].totalPrecio").value(25.0))
                .andExpect(jsonPath("$[0].lineasCarrito").doesNotExist());
    }

    @Test
    void actualizarLineaCarritoUsaModeloDeActualizacion() throws Exception {
        Long idCarrito = 3L;
        Long idLineaCarrito = 9L;

        Carrito carrito = new Carrito(8L, "linea@test.com");
        carrito.idCarrito = idCarrito;

        LineaCarrito lineaActualizada = new LineaCarrito(carrito, 88L, 15.0, 4);
        lineaActualizada.idLineaCarrito = idLineaCarrito;

        when(carritoService.obtenerPorId(idCarrito)).thenReturn(Optional.of(carrito));
        when(carritoService.actualizarLineaCarrito(eq(idLineaCarrito), eq(4))).thenReturn(lineaActualizada);

        mockMvc.perform(put("/api/carrito/{idCarrito}/lineas/{idLineaCarrito}", idCarrito, idLineaCarrito)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"numeroUnidades\": 4
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idLineaCarrito").value(9))
                .andExpect(jsonPath("$.idCarrito").value(3))
                .andExpect(jsonPath("$.idArticulo").value(88))
                .andExpect(jsonPath("$.numeroUnidades").value(4))
                .andExpect(jsonPath("$.costeLineaArticulo").value(60.0));
    }
}

