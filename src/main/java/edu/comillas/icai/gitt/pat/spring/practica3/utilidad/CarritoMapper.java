package edu.comillas.icai.gitt.pat.spring.practica3.utilidad;

import edu.comillas.icai.gitt.pat.spring.practica3.entidad.Carrito;
import edu.comillas.icai.gitt.pat.spring.practica3.entidad.LineaCarrito;
import edu.comillas.icai.gitt.pat.spring.practica3.model.CarritoRequest;
import edu.comillas.icai.gitt.pat.spring.practica3.model.CarritoResponse;
import edu.comillas.icai.gitt.pat.spring.practica3.model.LineaCarritoResponse;

public final class CarritoMapper {

    private CarritoMapper() {
    }

    public static Carrito toEntity(CarritoRequest carritoRequest) {
        return new Carrito(carritoRequest.idUsuario(), carritoRequest.correoUsuario());
    }

    public static CarritoResponse toResponse(Carrito carrito) {
        return new CarritoResponse(
                carrito.idCarrito,
                carrito.idUsuario,
                carrito.correoUsuario,
                carrito.totalPrecio
        );
    }

    public static LineaCarritoResponse toResponse(LineaCarrito lineaCarrito) {
        return new LineaCarritoResponse(
                lineaCarrito.idLineaCarrito,
                lineaCarrito.carrito.idCarrito,
                lineaCarrito.idArticulo,
                lineaCarrito.precioUnitario,
                lineaCarrito.numeroUnidades,
                lineaCarrito.costeLineaArticulo
        );
    }
}

