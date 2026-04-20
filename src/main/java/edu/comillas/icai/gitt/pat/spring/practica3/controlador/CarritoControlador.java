package edu.comillas.icai.gitt.pat.spring.practica3.controlador;

import edu.comillas.icai.gitt.pat.spring.practica3.entidad.Carrito;
import edu.comillas.icai.gitt.pat.spring.practica3.entidad.LineaCarrito;
import edu.comillas.icai.gitt.pat.spring.practica3.model.ActualizarLineaCarritoRequest;
import edu.comillas.icai.gitt.pat.spring.practica3.model.CarritoRequest;
import edu.comillas.icai.gitt.pat.spring.practica3.model.CarritoResponse;
import edu.comillas.icai.gitt.pat.spring.practica3.model.LineaCarritoRequest;
import edu.comillas.icai.gitt.pat.spring.practica3.model.LineaCarritoResponse;
import edu.comillas.icai.gitt.pat.spring.practica3.servicio.CarritoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static edu.comillas.icai.gitt.pat.spring.practica3.utilidad.CarritoMapper.toEntity;
import static edu.comillas.icai.gitt.pat.spring.practica3.utilidad.CarritoMapper.toResponse;

@RestController
@RequestMapping("/api/carrito")
public class CarritoControlador {

    private final CarritoService carritoService;

    public CarritoControlador(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    /**
     * Obtiene todos los carritos
     */
    @GetMapping
    public ResponseEntity<List<CarritoResponse>> getCarritos() {
        List<CarritoResponse> carritos = StreamSupport.stream(carritoService.obtenerTodos().spliterator(), false)
                .map(edu.comillas.icai.gitt.pat.spring.practica3.utilidad.CarritoMapper::toResponse)
                .toList();
        return ResponseEntity.ok(carritos);
    }

    /**
     * Crea un nuevo carrito
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CarritoResponse> creaCarrito(@RequestBody CarritoRequest carritoRequest) {
        Carrito nuevoCarrito = carritoService.crear(toEntity(carritoRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(nuevoCarrito));
    }

    /**
     * Obtiene un carrito dado su idCarrito
     */
    @GetMapping("/{idCarrito}")
    public ResponseEntity<CarritoResponse> getCarrito(@PathVariable Long idCarrito) {
        Optional<Carrito> carrito = carritoService.obtenerPorId(idCarrito);
        return carrito.map(value -> ResponseEntity.ok(toResponse(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Elimina un carrito dado su idCarrito
     */
    @DeleteMapping("/{idCarrito}")
    public ResponseEntity<Void> deleteCarrito(@PathVariable Long idCarrito) {
        if (carritoService.obtenerPorId(idCarrito).isPresent()) {
            carritoService.eliminar(idCarrito);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Modifica un carrito dado su idCarrito
     */
    @PutMapping("/{idCarrito}")
    public ResponseEntity<CarritoResponse> modificarCarrito(@PathVariable Long idCarrito, @RequestBody CarritoRequest carritoActualizado) {
        Carrito carrito = carritoService.actualizar(idCarrito, toEntity(carritoActualizado));
        if (carrito != null) {
            return ResponseEntity.ok(toResponse(carrito));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Añade una línea de carrito
     */
    @PostMapping("/{idCarrito}/lineas")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<LineaCarritoResponse> anadirLineaCarrito(
            @PathVariable Long idCarrito,
            @RequestBody LineaCarritoRequest lineaCarrito) {
        LineaCarrito nuevaLinea = carritoService.anadirLineaCarrito(
                idCarrito,
                lineaCarrito.idArticulo(),
                lineaCarrito.precioUnitario(),
                lineaCarrito.numeroUnidades()
        );
        if (nuevaLinea != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(nuevaLinea));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Obtiene todas las líneas de un carrito
     */
    @GetMapping("/{idCarrito}/lineas")
    public ResponseEntity<List<LineaCarritoResponse>> obtenerLineasCarrito(@PathVariable Long idCarrito) {
        if (carritoService.obtenerPorId(idCarrito).isPresent()) {
            List<LineaCarritoResponse> lineas = carritoService.obtenerLineasCarrito(idCarrito)
                    .stream()
                    .map(edu.comillas.icai.gitt.pat.spring.practica3.utilidad.CarritoMapper::toResponse)
                    .toList();
            return ResponseEntity.ok(lineas);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Obtiene una línea de carrito específica
     */
    @GetMapping("/{idCarrito}/lineas/{idLineaCarrito}")
    public ResponseEntity<LineaCarritoResponse> obtenerLineaCarrito(
            @PathVariable Long idCarrito,
            @PathVariable Long idLineaCarrito) {
        if (carritoService.obtenerPorId(idCarrito).isPresent()) {
            Optional<LineaCarrito> linea = carritoService.obtenerLineaCarrito(idLineaCarrito);
            return linea.map(value -> ResponseEntity.ok(toResponse(value)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Elimina una línea de carrito
     */
    @DeleteMapping("/{idCarrito}/lineas/{idLineaCarrito}")
    public ResponseEntity<Void> eliminarLineaCarrito(
            @PathVariable Long idCarrito,
            @PathVariable Long idLineaCarrito) {
        if (carritoService.obtenerPorId(idCarrito).isPresent()) {
            Optional<LineaCarrito> linea = carritoService.obtenerLineaCarrito(idLineaCarrito);
            if (linea.isPresent()) {
                carritoService.eliminarLineaCarrito(idLineaCarrito);
                return ResponseEntity.noContent().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Actualiza una línea de carrito
     */
    @PutMapping("/{idCarrito}/lineas/{idLineaCarrito}")
    public ResponseEntity<LineaCarritoResponse> actualizarLineaCarrito(
            @PathVariable Long idCarrito,
            @PathVariable Long idLineaCarrito,
            @RequestBody ActualizarLineaCarritoRequest lineaCarrito) {
        if (carritoService.obtenerPorId(idCarrito).isPresent()) {
            LineaCarrito lineaActualizada = carritoService.actualizarLineaCarrito(
                    idLineaCarrito,
                    lineaCarrito.numeroUnidades()
            );
            if (lineaActualizada != null) {
                return ResponseEntity.ok(toResponse(lineaActualizada));
            }
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Vacía un carrito (elimina todas sus líneas)
     */
    @DeleteMapping("/{idCarrito}/lineas")
    public ResponseEntity<Void> vaciarCarrito(@PathVariable Long idCarrito) {
        if (carritoService.obtenerPorId(idCarrito).isPresent()) {
            carritoService.vaciarCarrito(idCarrito);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}