package edu.comillas.icai.gitt.pat.spring.practica3.servicio;

import edu.comillas.icai.gitt.pat.spring.practica3.entidad.Carrito;
import edu.comillas.icai.gitt.pat.spring.practica3.entidad.LineaCarrito;
import edu.comillas.icai.gitt.pat.spring.practica3.repositorio.CarritoRepository;
import edu.comillas.icai.gitt.pat.spring.practica3.repositorio.LineaCarritoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;

    private final LineaCarritoRepository lineaCarritoRepository;

    public CarritoService(CarritoRepository carritoRepository, LineaCarritoRepository lineaCarritoRepository) {
        this.carritoRepository = carritoRepository;
        this.lineaCarritoRepository = lineaCarritoRepository;
    }

    /**
     * Obtiene todos los carritos
     */
    public Iterable<Carrito> obtenerTodos() {
        return carritoRepository.findAll();
    }

    /**
     * Obtiene un carrito por su ID
     */
    public Optional<Carrito> obtenerPorId(Long idCarrito) {
        return carritoRepository.findById(idCarrito);
    }

    /**
     * Obtiene carritos de un usuario específico
     */
    public List<Carrito> obtenerPorIdUsuario(Long idUsuario) {
        return carritoRepository.findByIdUsuario(idUsuario);
    }

    /**
     * Crea un nuevo carrito
     */
    public Carrito crear(Carrito carrito) {
        carrito.totalPrecio = 0.0;
        return carritoRepository.save(carrito);
    }

    /**
     * Actualiza un carrito existente
     */
    public Carrito actualizar(Long idCarrito, Carrito carritoActualizado) {
        Optional<Carrito> carritoExistente = carritoRepository.findById(idCarrito);
        if (carritoExistente.isPresent()) {
            Carrito carrito = carritoExistente.get();
            carrito.idUsuario = carritoActualizado.idUsuario;
            carrito.correoUsuario = carritoActualizado.correoUsuario;
            return carritoRepository.save(carrito);
        }
        return null;
    }

    /**
     * Elimina un carrito por su ID
     */
    public void eliminar(Long idCarrito) {
        carritoRepository.deleteById(idCarrito);
    }

    /**
     * Añade una línea de carrito
     */
    public LineaCarrito anadirLineaCarrito(Long idCarrito, Long idArticulo, Double precioUnitario, Integer numeroUnidades) {
        Optional<Carrito> carrito = carritoRepository.findById(idCarrito);
        if (carrito.isPresent()) {
            LineaCarrito lineaCarrito = new LineaCarrito(carrito.get(), idArticulo, precioUnitario, numeroUnidades);
            LineaCarrito lineaGuardada = lineaCarritoRepository.save(lineaCarrito);
            
            // Actualizar el total del carrito
            actualizarTotalCarrito(idCarrito);
            
            return lineaGuardada;
        }
        return null;
    }

    /**
     * Obtiene las líneas de carrito de un carrito específico
     */
    public List<LineaCarrito> obtenerLineasCarrito(Long idCarrito) {
        return lineaCarritoRepository.findByCarritoIdCarrito(idCarrito);
    }

    /**
     * Obtiene una línea de carrito por su ID
     */
    public Optional<LineaCarrito> obtenerLineaCarrito(Long idLineaCarrito) {
        return lineaCarritoRepository.findById(idLineaCarrito);
    }

    /**
     * Elimina una línea de carrito
     */
    public void eliminarLineaCarrito(Long idLineaCarrito) {
        Optional<LineaCarrito> lineaCarrito = lineaCarritoRepository.findById(idLineaCarrito);
        if (lineaCarrito.isPresent()) {
            Long idCarrito = lineaCarrito.get().carrito.idCarrito;
            lineaCarritoRepository.deleteById(idLineaCarrito);
            
            // Actualizar el total del carrito
            actualizarTotalCarrito(idCarrito);
        }
    }

    /**
     * Actualiza una línea de carrito
     */
    public LineaCarrito actualizarLineaCarrito(Long idLineaCarrito, Integer numeroUnidades) {
        Optional<LineaCarrito> lineaCarrito = lineaCarritoRepository.findById(idLineaCarrito);
        if (lineaCarrito.isPresent()) {
            LineaCarrito linea = lineaCarrito.get();
            linea.numeroUnidades = numeroUnidades;
            linea.actualizarCoste();
            LineaCarrito lineaActualizada = lineaCarritoRepository.save(linea);
            
            // Actualizar el total del carrito
            actualizarTotalCarrito(linea.carrito.idCarrito);
            
            return lineaActualizada;
        }
        return null;
    }

    /**
     * Actualiza el total del carrito sumando todas sus líneas
     */
    public void actualizarTotalCarrito(Long idCarrito) {
        Optional<Carrito> carrito = carritoRepository.findById(idCarrito);
        if (carrito.isPresent()) {
            List<LineaCarrito> lineas = lineaCarritoRepository.findByCarritoIdCarrito(idCarrito);
            Double total = lineas.stream()
                    .mapToDouble(l -> l.costeLineaArticulo)
                    .sum();
            
            Carrito c = carrito.get();
            c.totalPrecio = total;
            carritoRepository.save(c);
        }
    }

    /**
     * Vacía un carrito (elimina todas sus líneas)
     */
    public void vaciarCarrito(Long idCarrito) {
        List<LineaCarrito> lineas = lineaCarritoRepository.findByCarritoIdCarrito(idCarrito);
        lineaCarritoRepository.deleteAll(lineas);
        
        // Actualizar el total del carrito
        actualizarTotalCarrito(idCarrito);
    }
}

