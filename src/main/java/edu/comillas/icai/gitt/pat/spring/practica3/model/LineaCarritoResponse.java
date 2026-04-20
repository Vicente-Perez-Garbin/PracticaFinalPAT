package edu.comillas.icai.gitt.pat.spring.practica3.model;

public record LineaCarritoResponse(
        Long idLineaCarrito,
        Long idCarrito,
        Long idArticulo,
        Double precioUnitario,
        Integer numeroUnidades,
        Double costeLineaArticulo
) {
}

