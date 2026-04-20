package edu.comillas.icai.gitt.pat.spring.practica3.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "carritos")
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long idCarrito;

    @Column(nullable = false)
    public Long idUsuario;

    @Column(nullable = false)
    public String correoUsuario;

    @Column(nullable = false)
    public Double totalPrecio = 0.0;

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    public List<LineaCarrito> lineasCarrito;

    public Carrito() {
    }

    public Carrito(Long idUsuario, String correoUsuario) {
        this.idUsuario = idUsuario;
        this.correoUsuario = correoUsuario;
        this.totalPrecio = 0.0;
    }
}
