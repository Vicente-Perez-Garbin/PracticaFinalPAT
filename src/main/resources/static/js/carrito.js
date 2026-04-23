// API base URL
const API_URL = 'http://localhost:8080/api';

// Credenciales demo hardcodeadas (sin autenticacion real)
const USUARIO_DEMO = {
  idUsuario: 1,
  correoUsuario: 'cliente.demo@nightcart.com',
  contrasena: 'pat2026'
};

// Catálogo mínimo para mostrar nombres legibles en el carrito
const NOMBRES_PRODUCTOS = {
  1: 'Salsa al Ritmo del famosísimo y mundialmente conocido Perro Español',
  2: 'Pack Maracas Tropical + Macarena Trajeados',
  3: 'Batalla FMS by JD',
  4: 'Kharma Private Experience',
  5: 'Mesa Techno + Kit Bienestar',
  6: 'Reggaeton Classics',
  7: 'Pool Party'
};

const CUPON_DESCUENTO = 'ATILANOPONMEUN10';
const CUPON_GUARDADO_KEY = 'carritoCuponCodigo';
let descuentoPorcentaje = 0;

// Objeto para almacenar los datos del carrito actual
let carritoActual = {
  idCarrito: null,
  lineas: [],
  totalPrecio: 0,
  idUsuario: USUARIO_DEMO.idUsuario,
  correoUsuario: USUARIO_DEMO.correoUsuario
};

function obtenerNombreProducto(idArticulo) {
  return NOMBRES_PRODUCTOS[idArticulo] || `Artículo ${idArticulo}`;
}

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
  setupEventListeners();
  await inicializarCarrito();
  restaurarCuponGuardado();
});

// Crear o recuperar carrito
async function inicializarCarrito() {
  const carritoGuardado = localStorage.getItem('carritoId');
  
  if (carritoGuardado) {
    carritoActual.idCarrito = parseInt(carritoGuardado);
    const cargado = await cargarCarrito(carritoActual.idCarrito);
    if (!cargado) {
      localStorage.removeItem('carritoId');
      await crearCarrito();
    }
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
      carritoActual.lineas = [];
      carritoActual.totalPrecio = 0;
      localStorage.setItem('carritoId', nuevoCarrito.idCarrito);
      console.log('Carrito creado:', nuevoCarrito.idCarrito);
      document.dispatchEvent(new CustomEvent('carritoActualizado', { detail: carritoActual }));
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
      carritoActual.totalPrecio = carrito.totalPrecio || 0;
      carritoActual.correoUsuario = carrito.correoUsuario;
      carritoActual.idUsuario = carrito.idUsuario;

      const lineasResponse = await fetch(`${API_URL}/carrito/${idCarrito}/lineas`);
      if (lineasResponse.ok) {
        const lineas = await lineasResponse.json();
        carritoActual.lineas = lineas.map(linea => ({
          ...linea,
          nombreArticulo: linea.nombreArticulo || obtenerNombreProducto(linea.idArticulo)
        }));
      } else {
        carritoActual.lineas = [];
      }

      console.log('Carrito cargado:', carrito);
      document.dispatchEvent(new CustomEvent('carritoActualizado', { detail: carritoActual }));
      return true;
    }

    if (response.status === 404) {
      console.warn('Carrito no encontrado, se creará uno nuevo.');
      return false;
    }

    console.error('Error al cargar carrito:', response.status, response.statusText);
    return false;
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    return false;
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

  const tramitarPedidoBtn = document.getElementById('tramitarPedidoBtn');
  if (tramitarPedidoBtn) {
    tramitarPedidoBtn.addEventListener('click', tramitarPedido);
  }
  
  const cuponForm = document.getElementById('cuponForm');
  if (cuponForm) {
    cuponForm.addEventListener('submit', function(event) {
      event.preventDefault();
      aplicarCupon();
    });
  }

  // Aplicar cupón con botón
  const btnAplicarCupon = document.getElementById('aplicarCuponBtn');
  if (btnAplicarCupon) {
    btnAplicarCupon.addEventListener('click', aplicarCupon);
  }
}

function aplicarCupon() {
  const cuponInput = document.getElementById('cupon');
  const cuponFeedback = document.getElementById('cuponFeedback');

  if (!cuponInput) {
    return;
  }

  const codigoCupon = cuponInput.value.trim();

  aplicarCuponDesdeCodigo(codigoCupon, true);

  if (!codigoCupon) {
    if (cuponFeedback) {
      cuponFeedback.textContent = 'Por favor ingresa un código de cupón.';
      cuponFeedback.style.color = '#ff6b6b';
    }
    return;
  }

  if (codigoCupon === CUPON_DESCUENTO) {
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
}

function aplicarCuponDesdeCodigo(codigoCupon, persistir) {
  if (!codigoCupon) {
    descuentoPorcentaje = 0;
    localStorage.removeItem(CUPON_GUARDADO_KEY);
    actualizarTotales(carritoActual);
    return;
  }

  if (codigoCupon === CUPON_DESCUENTO) {
    descuentoPorcentaje = 0.10;
    if (persistir) {
      localStorage.setItem(CUPON_GUARDADO_KEY, codigoCupon);
    }
  } else {
    descuentoPorcentaje = 0;
    localStorage.removeItem(CUPON_GUARDADO_KEY);
  }

  actualizarTotales(carritoActual);
}

function restaurarCuponGuardado() {
  const codigoCupon = localStorage.getItem(CUPON_GUARDADO_KEY);
  if (!codigoCupon) {
    return;
  }

  const cuponInput = document.getElementById('cupon');
  const cuponFeedback = document.getElementById('cuponFeedback');

  if (cuponInput) {
    cuponInput.value = codigoCupon;
  }

  aplicarCuponDesdeCodigo(codigoCupon, false);

  if (cuponFeedback) {
    if (codigoCupon === CUPON_DESCUENTO) {
      cuponFeedback.textContent = 'Cupón válido: 10% de descuento aplicado';
      cuponFeedback.style.color = '#51cf66';
    } else {
      cuponFeedback.textContent = 'Cupón no válido. Intenta con otro código.';
      cuponFeedback.style.color = '#ff6b6b';
    }
  }
}

async function tramitarPedido() {
  const pedidoFeedback = document.getElementById('pedidoFeedback');

  if (!carritoActual.idCarrito) {
    if (pedidoFeedback) {
      pedidoFeedback.textContent = 'No hay carrito activo para tramitar.';
      pedidoFeedback.style.color = '#ff6b6b';
    }
    return;
  }

  if (carritoActual.lineas.length === 0) {
    if (pedidoFeedback) {
      pedidoFeedback.textContent = 'El carrito está vacío. Añade productos antes de tramitar el pedido.';
      pedidoFeedback.style.color = '#ff6b6b';
    }
    return;
  }

  const idCarritoTramitado = carritoActual.idCarrito;

  if (!confirm('¿Quieres tramitar este pedido y crear un carrito nuevo?')) {
    return;
  }

  descuentoPorcentaje = 0;
  const cuponInput = document.getElementById('cupon');
  const cuponFeedback = document.getElementById('cuponFeedback');
  if (cuponInput) {
    cuponInput.value = '';
  }
  if (cuponFeedback) {
    cuponFeedback.textContent = '';
  }
  localStorage.removeItem(CUPON_GUARDADO_KEY);

  await crearCarrito();

  if (pedidoFeedback) {
    pedidoFeedback.textContent = `Pedido tramitado correctamente (carrito ${idCarritoTramitado}). Ya tienes un carrito nuevo activo.`;
    pedidoFeedback.style.color = '#51cf66';
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
    document.querySelectorAll('tfoot').forEach(el => {
      el.style.display = 'none';
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
  const descuento = total * descuentoPorcentaje;
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
