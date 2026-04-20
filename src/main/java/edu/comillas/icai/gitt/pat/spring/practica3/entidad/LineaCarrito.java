package edu.comillas.icai.gitt.pat.spring.practica3.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "lineas_carrito")
public class LineaCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long idLineaCarrito;

    @ManyToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    public Carrito carrito;

    @Column(nullable = false)
    public Long idArticulo;

    @Column(nullable = false)
    public Double precioUnitario;

    @Column(nullable = false)
    public Integer numeroUnidades;

    @Column(nullable = false)
    public Double costeLineaArticulo;

    // Constructores
    public LineaCarrito() {
    }

    public LineaCarrito(Carrito carrito, Long idArticulo, Double precioUnitario, Integer numeroUnidades) {
        this.carrito = carrito;
        this.idArticulo = idArticulo;
        this.precioUnitario = precioUnitario;
        this.numeroUnidades = numeroUnidades;
        this.costeLineaArticulo = precioUnitario * numeroUnidades;
    }

    // Método para actualizar el coste
    public void actualizarCoste() {
        this.costeLineaArticulo = this.precioUnitario * this.numeroUnidades;
    }
}
