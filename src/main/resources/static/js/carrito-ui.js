// Escuchar cambios en el carrito
document.addEventListener('carritoActualizado', function(e) {
  actualizarUICarrito(e.detail);
});

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
  const subtotalEl = document.getElementById('subtotalValue');
  const descuentoEl = document.getElementById('descuentoValue');
  const totalEl = document.getElementById('totalValue');
  
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

// Aplicar cupón
document.addEventListener('DOMContentLoaded', function() {
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
});
