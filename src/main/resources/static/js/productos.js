// Array de productos disponibles
const productos = [
  {
    id: 1,
    nombre: 'Salsa al Ritmo del famosísimo y mundialmente conocido Perro Español',
    lugar: 'Azúcar',
    dia: 'Lunes',
    descripcion: 'Exclusiva! Disfruta y comparte pista de baile con el viral perro español!',
    precio: 25.00,
    imagen: 'assets/media/imagen-azucar.jpeg'
  },
  {
    id: 2,
    nombre: 'Pack Maracas Tropical + Macarena Trajeados',
    lugar: 'Maracas',
    dia: 'Martes',
    descripcion: 'Disfruta en el oasis tropical maracas de un servicio a mesa de bailarines trajeados personificando la macarena.',
    precio: 55.00,
    imagen: 'assets/media/imagen-maracas.jpeg'
  },
  {
    id: 3,
    nombre: 'Batalla FMS by JD',
    lugar: 'Coconut',
    dia: 'Miércoles',
    descripcion: 'Baja al barro, cumple tu sueño y participa en el evento underground de batallas de rap más prestigioso del circuito.',
    precio: 200.00,
    imagen: 'assets/media/imagen-coconut.jpeg'
  },
  {
    id: 4,
    nombre: 'Kharma Private Experience',
    lugar: 'Kharma (Jaén)',
    dia: 'Jueves',
    descripcion: 'Contrata para tí o alguno de tus amigos un servicio de máxima discreción con el que en el momento más oportuno de la noche un vareador enmascarado aparecerá tras tú objetivo con intensidad a petición por el cliente!',
    precio: 300.00,
    imagen: 'assets/media/imagen-kharma.jpeg'
  },
  {
    id: 5,
    nombre: 'Mesa Techno + Kit Bienestar',
    lugar: 'CODE/Fabrik',
    dia: 'Viernes',
    descripcion: 'Disfruta de una movidita noche de hard techno en el backstage con servicio a mesa del kit de bienestar (agua fría e ibuprofeno).',
    precio: 150.00,
    imagen: 'assets/media/imagen-fabrik.jpeg'
  },
  {
    id: 6,
    nombre: 'Reggaeton Classics',
    lugar: 'Barceló',
    dia: 'Sábado',
    descripcion: 'Una noche dedicada completamente al reggaeton con los ritmos más pegadizos del momento.',
    precio: 45.00,
    imagen: 'assets/media/imagen-barcelo.jpeg'
  },
  {
    id: 7,
    nombre: 'Pool Party',
    lugar: 'JowkeShow',
    dia: 'Domingo',
    descripcion: 'Cierre de fin de semana con la mejor piscina party de la región.',
    precio: 65.00,
    imagen: 'assets/media/imagen-jowke.jpeg'
  }
];

// Cargar productos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  cargarProductos();
  enlazarBotonesEstaticos();
});

// Función para cargar y mostrar productos
function cargarProductos() {
  const contenedor = document.getElementById('productoContainer');
  
  if (!contenedor) return;
  
  contenedor.innerHTML = '';
  
  productos.forEach(producto => {
    const card = crearTarjetaProducto(producto);
    contenedor.appendChild(card);
  });
}

// Si la pagina tiene HTML estatico, enlaza los botones actuales del DOM
function enlazarBotonesEstaticos() {
  const botonesTabla = document.querySelectorAll('.table-wrap tbody .btn');
  const botonesCards = document.querySelectorAll('.product-grid .btn');

  botonesTabla.forEach((boton, index) => {
    const producto = productos[index];
    if (!producto) return;
    boton.addEventListener('click', function() {
      anadirProductoAlCarrito(producto.id, producto.nombre, producto.precio);
    });
  });

  botonesCards.forEach((boton, index) => {
    const producto = productos[index];
    if (!producto) return;
    boton.addEventListener('click', function() {
      anadirProductoAlCarrito(producto.id, producto.nombre, producto.precio);
    });
  });
}

// Crear elemento HTML para cada producto
function crearTarjetaProducto(producto) {
  const article = document.createElement('article');
  article.className = 'card product-card';
  
  const precioFormateado = producto.precio.toFixed(2).replace('.', ',');
  
  article.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p><strong>${producto.lugar} · ${producto.dia}</strong></p>
    <p>${producto.descripcion}</p>
    <p><strong>${precioFormateado} EUR</strong></p>
    <button type="button" class="btn" onclick="anadirProductoAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">Añadir al carrito</button>
  `;
  
  return article;
}

// Función para añadir producto al carrito
function anadirProductoAlCarrito(id, nombre, precio) {
  anadirLineaCarrito(id, nombre, precio);
  
  // Mostrar mensaje de confirmación
  alert(`"${nombre}" ha sido añadido al carrito`);
}
