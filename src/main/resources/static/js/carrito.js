// API base URL
const API_URL = 'http://localhost:8080/api';

// Objeto para almacenar los datos del carrito actual
let carritoActual = {
  idCarrito: null,
  lineas: [],
  totalPrecio: 0,
  idUsuario: 1,
  correoUsuario: 'usuario@example.com'
};

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  inicializarCarrito();
  setupEventListeners();
});

// Crear o recuperar carrito
async function inicializarCarrito() {
  const carritoGuardado = localStorage.getItem('carritoId');
  
  if (carritoGuardado) {
    carritoActual.idCarrito = parseInt(carritoGuardado);
    await cargarCarrito(carritoActual.idCarrito);
  } else {
    await crearCarrito();
  }
}

// Crear un nuevo carrito
async function crearCarrito() {
  try {
    const response = await fetch(`${API_URL}/carrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idUsuario: carritoActual.idUsuario,
        correoUsuario: carritoActual.correoUsuario
      })
    });

    if (response.ok) {
      const nuevoCarrito = await response.json();
      carritoActual.idCarrito = nuevoCarrito.idCarrito;
      localStorage.setItem('carritoId', nuevoCarrito.idCarrito);
      console.log('Carrito creado:', nuevoCarrito.idCarrito);
    }
  } catch (error) {
    console.error('Error al crear carrito:', error);
  }
}

// Cargar carrito existente
async function cargarCarrito(idCarrito) {
  try {
    const response = await fetch(`${API_URL}/carrito/${idCarrito}`);
    
    if (response.ok) {
      const carrito = await response.json();
      carritoActual.lineas = carrito.lineas || [];
      carritoActual.totalPrecio = carrito.totalPrecio || 0;
      carritoActual.correoUsuario = carrito.correoUsuario;
      carritoActual.idUsuario = carrito.idUsuario;
      console.log('Carrito cargado:', carrito);
    }
  } catch (error) {
    console.error('Error al cargar carrito:', error);
  }
}

// Añadir línea al carrito
async function anadirLineaCarrito(idArticulo, nombreArticulo, precioUnitario) {
  if (!carritoActual.idCarrito) {
    await crearCarrito();
  }

  try {
    const response = await fetch(`${API_URL}/carrito/${carritoActual.idCarrito}/lineas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idArticulo: idArticulo,
        precioUnitario: precioUnitario,
        numeroUnidades: 1
      })
    });

    if (response.ok) {
      const lineaCarrito = await response.json();
      carritoActual.lineas.push({
        idLineaCarrito: lineaCarrito.idLineaCarrito,
        idArticulo: idArticulo,
        nombreArticulo: nombreArticulo,
        precioUnitario: precioUnitario,
        numeroUnidades: 1,
        costeLineaArticulo: precioUnitario
      });
      
      console.log('Línea añadida al carrito:', lineaCarrito);
      
      // Emitir evento personalizado
      const event = new CustomEvent('carritoActualizado', { detail: carritoActual });
      document.dispatchEvent(event);
      
      return true;
    } else {
      console.error('Error al añadir línea:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error al añadir línea al carrito:', error);
    return false;
  }
}

// Eliminar línea del carrito
async function eliminarLineaCarrito(idLineaCarrito) {
  try {
    const response = await fetch(`${API_URL}/carrito/${carritoActual.idCarrito}/lineas/${idLineaCarrito}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Actualizar el array local
      carritoActual.lineas = carritoActual.lineas.filter(linea => linea.idLineaCarrito !== idLineaCarrito);
      console.log('Línea eliminada del carrito');
      
      // Emitir evento personalizado
      const event = new CustomEvent('carritoActualizado', { detail: carritoActual });
      document.dispatchEvent(event);
      
      return true;
    }
  } catch (error) {
    console.error('Error al eliminar línea:', error);
    return false;
  }
}

// Actualizar cantidad de una línea
async function actualizarLineaCarrito(idLineaCarrito, nuevaCantidad) {
  try {
    const response = await fetch(`${API_URL}/carrito/${carritoActual.idCarrito}/lineas/${idLineaCarrito}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numeroUnidades: nuevaCantidad
      })
    });

    if (response.ok) {
      // Actualizar el array local
      const linea = carritoActual.lineas.find(l => l.idLineaCarrito === idLineaCarrito);
      if (linea) {
        linea.numeroUnidades = nuevaCantidad;
        linea.costeLineaArticulo = linea.precioUnitario * nuevaCantidad;
      }
      
      console.log('Línea actualizada');
      
      // Emitir evento personalizado
      const event = new CustomEvent('carritoActualizado', { detail: carritoActual });
      document.dispatchEvent(event);
      
      return true;
    }
  } catch (error) {
    console.error('Error al actualizar línea:', error);
    return false;
  }
}

// Calcular total del carrito
function calcularTotal() {
  let total = 0;
  carritoActual.lineas.forEach(linea => {
    total += linea.costeLineaArticulo || (linea.precioUnitario * linea.numeroUnidades);
  });
  carritoActual.totalPrecio = total;
  return total;
}

// Obtener número de items en el carrito
function contarItems() {
  return carritoActual.lineas.length;
}

// ===== FUNCIONES DE INTERFAZ (UI) =====

// Escuchar cambios en el carrito
function setupEventListeners() {
  document.addEventListener('carritoActualizado', function(e) {
    actualizarUICarrito(e.detail);
  });
  
  // Aplicar cupón
  const btnAplicarCupon = document.getElementById('aplicarCuponBtn');
  if (btnAplicarCupon) {
    btnAplicarCupon.addEventListener('click', function() {
      const cuponInput = document.getElementById('cupon');
      const cuponFeedback = document.getElementById('cuponFeedback');
      
      const codigoCupon = cuponInput.value.trim();
      
      if (!codigoCupon) {
        if (cuponFeedback) {
          cuponFeedback.textContent = 'Por favor ingresa un código de cupón.';
          cuponFeedback.style.color = '#ff6b6b';
        }
        return;
      }
      
      // Simular validación de cupón
      if (codigoCupon === 'ATILANOPONMEUN10') {
        if (cuponFeedback) {
          cuponFeedback.textContent = 'Cupón válido: 10% de descuento aplicado';
          cuponFeedback.style.color = '#51cf66';
        }
      } else {
        if (cuponFeedback) {
          cuponFeedback.textContent = 'Cupón no válido. Intenta con otro código.';
          cuponFeedback.style.color = '#ff6b6b';
        }
      }
    });
  }
}

// Actualizar interfaz del carrito
function actualizarUICarrito(carrito) {
  const tablaCuerpo = document.getElementById('carritoLineas');
  const carritoVacio = document.getElementById('carritoVacio');
  
  if (!tablaCuerpo) return;
  
  // Limpiar tabla
  tablaCuerpo.innerHTML = '';
  
  if (carrito.lineas.length === 0) {
    // Mostrar mensaje de carrito vacío
    if (carritoVacio) {
      carritoVacio.style.display = 'block';
    }
    document.querySelectorAll('tbody + * tfoot').forEach(el => {
      if (el.tagName === 'TFOOT') {
        el.style.display = 'none';
      }
    });
  } else {
    // Ocultar mensaje de carrito vacío
    if (carritoVacio) {
      carritoVacio.style.display = 'none';
    }
    
    // Mostrar filas de la tabla
    document.querySelectorAll('tfoot').forEach(el => {
      el.style.display = 'table-row-group';
    });
    
    // Llenar tabla con líneas
    carrito.lineas.forEach(linea => {
      const fila = document.createElement('tr');
      
      const precioUnitario = linea.precioUnitario.toFixed(2).replace('.', ',');
      const subtotal = (linea.precioUnitario * linea.numeroUnidades).toFixed(2).replace('.', ',');
      
      fila.innerHTML = `
        <td>${linea.nombreArticulo}</td>
        <td><input type="number" value="${linea.numeroUnidades}" min="1" onchange="actualizarCantidad(${linea.idLineaCarrito}, this.value)"></td>
        <td>${precioUnitario} EUR</td>
        <td>${subtotal} EUR</td>
        <td><button type="button" class="btn btn-small" onclick="eliminarProducto(${linea.idLineaCarrito})">Eliminar</button></td>
      `;
      
      tablaCuerpo.appendChild(fila);
    });
  }
  
  // Actualizar totales
  actualizarTotales(carrito);
}

// Actualizar totales en el pie de tabla
function actualizarTotales(carrito) {
  const subtotalEl = document.querySelector('tfoot tr:nth-child(1) th:nth-child(2)');
  const descuentoEl = document.querySelector('tfoot tr:nth-child(2) th:nth-child(2)');
  const totalEl = document.querySelector('tfoot tr:nth-child(3) th:nth-child(2)');
  
  const total = calcularTotal();
  const descuento = 0; // Inicialmente sin descuento
  const totalFinal = total - descuento;
  
  if (subtotalEl) {
    subtotalEl.textContent = total.toFixed(2).replace('.', ',') + ' EUR';
  }
  
  if (descuentoEl) {
    descuentoEl.textContent = descuento.toFixed(2).replace('.', ',') + ' EUR';
  }
  
  if (totalEl) {
    totalEl.textContent = totalFinal.toFixed(2).replace('.', ',') + ' EUR';
  }
}

// Actualizar cantidad de un producto
function actualizarCantidad(idLineaCarrito, nuevaCantidad) {
  if (nuevaCantidad < 1) {
    alert('La cantidad debe ser mayor a 0');
    return;
  }
  
  actualizarLineaCarrito(idLineaCarrito, parseInt(nuevaCantidad));
}

// Eliminar producto del carrito
function eliminarProducto(idLineaCarrito) {
  if (confirm('¿Deseas eliminar este producto del carrito?')) {
    eliminarLineaCarrito(idLineaCarrito);
  }
}
