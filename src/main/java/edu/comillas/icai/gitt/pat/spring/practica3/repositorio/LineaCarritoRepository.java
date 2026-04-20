package edu.comillas.icai.gitt.pat.spring.practica3.repositorio;

import edu.comillas.icai.gitt.pat.spring.practica3.entidad.LineaCarrito;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineaCarritoRepository extends CrudRepository<LineaCarrito, Long> {
    List<LineaCarrito> findByCarritoIdCarrito(Long idCarrito);
}

