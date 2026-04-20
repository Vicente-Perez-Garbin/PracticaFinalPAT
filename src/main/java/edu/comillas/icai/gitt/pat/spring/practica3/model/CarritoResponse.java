package edu.comillas.icai.gitt.pat.spring.practica3.model;

public record CarritoResponse(
        Long idCarrito,
        Long idUsuario,
        String correoUsuario,
        Double totalPrecio
) {
}

