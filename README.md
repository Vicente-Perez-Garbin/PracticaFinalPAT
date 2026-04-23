# Práctica 5: Consumo API REST - Night Cart

Web para compra de entradas y reservas de eventos con carrito dinámico. Backend API REST + frontend estático integrado.

🔗 **Acceso**: https://vicente-perez-garbin.github.io/PracticaFinalPAT/

## Qué hay aquí:

- Catálogo de 7 productos con imágenes
- Carrito dinámico: agregar, eliminar, cambiar cantidad
- Cálculo automático de totales
- Persistencia en navegador (localStorage)
- Interfaz con videos e imágenes

## Estructura

```
src/main/
├── java/edu/comillas/icai/gitt/pat/spring/practica3/
│   ├── controlador/CarritoControlador.java
│   ├── servicio/CarritoService.java
│   ├── entidad/ (Carrito.java, LineaCarrito.java)
│   ├── repositorio/
│   ├── config/CorsConfig.java
│   └── model/ (DTOs)
└── resources/static/
    ├── *.html (index, productos, carrito, contacto)
    ├── styles.css
    ├── js/ (carrito.js, productos.js)
    └── assets/media/ (imágenes y videos)
```

## Cupón de descuento

- Código válido: `ATILANOPONMEUN10`
- Descuento aplicado: `10%` sobre el subtotal del carrito

## Credenciales hardcodeadas (sin autenticación)

- Correo demo usado por el carrito: `cliente.demo@nightcart.com`
- Contraseña demo: `pat2026`
- La práctica no implementa login ni seguridad real; solo se simulan datos de usuario fijos para crear y gestionar el carrito.

## Endpoints API REST

| Método | Ruta                                   | Descripción      |
| ------- | -------------------------------------- | ----------------- |
| POST    | `/api/carrito`                       | Crear carrito     |
| GET     | `/api/carrito/{id}`                  | Obtener carrito   |
| DELETE  | `/api/carrito/{id}`                  | Eliminar carrito  |
| POST    | `/api/carrito/{id}/lineas`           | Agregar producto  |
| PUT     | `/api/carrito/{id}/lineas/{lineaId}` | Cambiar cantidad  |
| DELETE  | `/api/carrito/{id}/lineas/{lineaId}` | Eliminar producto |
