package edu.comillas.icai.gitt.pat.spring.practica3.repositorio;

import edu.comillas.icai.gitt.pat.spring.practica3.entidad.Carrito;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarritoRepository extends CrudRepository<Carrito, Long> {
    List<Carrito> findByIdUsuario(Long idUsuario);
}

