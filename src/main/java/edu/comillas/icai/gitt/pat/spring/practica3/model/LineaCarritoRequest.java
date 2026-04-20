package edu.comillas.icai.gitt.pat.spring.practica3.model;

public record LineaCarritoRequest(
        Long idArticulo,
        Double precioUnitario,
        Integer numeroUnidades
) {
}

