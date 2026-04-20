# Práctica 5: Consumo API REST - Night Cart

Aplicación web funcional que integra un backend API REST con un frontend estático. Sistema de compra de entradas y reservas de eventos con carrito dinámico.

## Compilar y ejecutar

```bash
cd PracticaFinalPAT
mvnw clean package -DskipTests
java -jar target/practica3-0.0.1-SNAPSHOT.jar
```

Acceder a: **http://localhost:8080**

## Estructura

```
src/main/
├── java/edu/comillas/icai/gitt/pat/spring/practica3/
│   ├── controlador/CarritoControlador.java (REST API endpoints)
│   ├── servicio/CarritoService.java (lógica de negocio)
│   ├── entidad/ (Carrito.java, LineaCarrito.java - modelos JPA)
│   ├── repositorio/ (acceso a datos)
│   ├── config/CorsConfig.java (configuración CORS)
│   └── model/ (DTOs para request/response)
└── resources/static/
    ├── index.html, productos.html, carrito.html, contacto.html
    ├── styles.css (tema oscuro)
    ├── js/ (carrito.js, productos.js, carrito-ui.js)
    └── assets/media/ (imágenes y videos)
```

## Funcionalidades

- ✅ Catálogo de 7 productos con imágenes
- ✅ Carrito dinámico con agregar/eliminar/cambiar cantidad
- ✅ Cálculo automático de totales
- ✅ Persistencia en localStorage
- ✅ Interfaz responsiva
- ✅ Imágenes y videos integrados
- ✅ JavaScript vanilla sin dependencias

## Endpoints API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/carrito` | Crear nuevo carrito |
| GET | `/api/carrito/{id}` | Obtener carrito |
| DELETE | `/api/carrito/{id}` | Eliminar carrito |
| POST | `/api/carrito/{id}/lineas` | Agregar producto |
| PUT | `/api/carrito/{id}/lineas/{lineaId}` | Actualizar cantidad |
| DELETE | `/api/carrito/{id}/lineas/{lineaId}` | Eliminar producto |

## Tecnologías

- **Backend**: Spring Boot 4.0.2, Spring Data JPA, H2, Java 23
- **Frontend**: HTML5, CSS3, JavaScript ES6+, localStorage, fetch API
- **Base de datos**: H2 en memoria (se reinicia con el servidor)
# Practica 3: API REST de carrito con persistencia y DTOs

Esta practica evoluciona la practica 2 del carrito en memoria.
Ahora el proyecto incluye persistencia con JPA + H2, separacion por capas y uso real de la carpeta `model` para desacoplar la API REST de las entidades JPA.

## Que se ha hecho en esta practica
- Se mantiene `Carrito` como recurso principal.
- Se añade la entidad `LineaCarrito` para modelar los articulos del carrito.
- Se incorpora persistencia con Spring Data JPA sobre H2.
- Se añade la capa `servicio` para la logica de negocio.
- Se añade la carpeta `model` con DTOs de entrada y salida para la API.
- Se añade la carpeta `utilidad` con un mapper para transformar entre entidades y DTOs.
- Se añaden endpoints para crear, consultar, actualizar y borrar lineas.
- Se recalcula automaticamente el total del carrito al modificar lineas.

## Separacion entre `entidad` y `model`

### Carpeta `entidad`
Contiene las clases JPA que representan la persistencia en base de datos:
- `Carrito`
- `LineaCarrito`

Estas clases se usan en repositorios y servicios, pero ya no se exponen directamente en la API.

### Carpeta `model`
Contiene los DTOs usados por controlador para recibir y devolver informacion:
- `CarritoRequest`
- `CarritoResponse`
- `LineaCarritoRequest`
- `ActualizarLineaCarritoRequest`
- `LineaCarritoResponse`

De esta forma:
- el cliente no envia campos calculados como `totalPrecio` o `costeLineaArticulo`,
- la API no expone directamente la estructura JPA,
- `model` deja de estar vacia y pasa a tener una funcion real dentro del proyecto.

## Modelo de datos interno

### Entidad `Carrito`
Campos principales:
- `idCarrito` (Long): identificador del carrito.
- `idUsuario` (Long): identificador del usuario.
- `correoUsuario` (String): correo del usuario.
- `totalPrecio` (Double): suma de los costes de sus lineas.

Relacion:
- Un carrito tiene varias lineas (`OneToMany`).

### Entidad `LineaCarrito`
Campos principales:
- `idLineaCarrito` (Long): identificador de la linea.
- `idCarrito` (Long): carrito al que pertenece.
- `idArticulo` (Long): identificador del articulo.
- `precioUnitario` (Double): precio por unidad.
- `numeroUnidades` (Integer): unidades de la linea.
- `costeLineaArticulo` (Double): `precioUnitario * numeroUnidades`.

Relacion:
- Varias lineas pertenecen a un carrito (`ManyToOne`).

## Arquitectura del proyecto
Estructura por capas:
- `controlador`: expone la API REST y trabaja con DTOs de `model`.
- `servicio`: contiene la logica de negocio (recalculo de total, gestion de lineas, etc.).
- `repositorio`: acceso a base de datos con Spring Data.
- `entidad`: clases JPA del dominio y de persistencia.
- `model`: request/response de la API.
- `utilidad`: mapeo entre `entidad` y `model`.

## Persistencia
Configurado en `src/main/resources/application.properties`:
- Base de datos H2 en memoria.
- `ddl-auto=create-drop` para crear el esquema en cada arranque.
- Consola H2 habilitada en `/h2-console`.

## API REST actual
Prefijo base: `/api/carrito`

### Endpoints de carrito
| Metodo | Ruta                       | Descripcion                                  | Respuestas                        |
|:-------|:---------------------------|:---------------------------------------------|:----------------------------------|
| GET    | `/api/carrito`             | Lista todos los carritos                     | `200 OK`                          |
| GET    | `/api/carrito/{idCarrito}` | Obtiene un carrito por ID                    | `200 OK`, `404 Not Found`         |
| POST   | `/api/carrito`             | Crea un carrito a partir de `CarritoRequest` | `201 Created`                     |
| PUT    | `/api/carrito/{idCarrito}` | Actualiza los datos editables del carrito    | `200 OK`, `404 Not Found`         |
| DELETE | `/api/carrito/{idCarrito}` | Elimina un carrito                           | `204 No Content`, `404 Not Found` |

### Endpoints de lineas de carrito
| Metodo | Ruta                                               | Descripcion                                                  | Respuestas                        |
|:-------|:---------------------------------------------------|:-------------------------------------------------------------|:----------------------------------|
| GET    | `/api/carrito/{idCarrito}/lineas`                  | Lista lineas de un carrito                                   | `200 OK`, `404 Not Found`         |
| GET    | `/api/carrito/{idCarrito}/lineas/{idLineaCarrito}` | Obtiene una linea concreta                                   | `200 OK`, `404 Not Found`         |
| POST   | `/api/carrito/{idCarrito}/lineas`                  | Añade una linea al carrito a partir de `LineaCarritoRequest` | `201 Created`, `404 Not Found`    |
| PUT    | `/api/carrito/{idCarrito}/lineas/{idLineaCarrito}` | Actualiza las unidades con `ActualizarLineaCarritoRequest`   | `200 OK`, `404 Not Found`         |
| DELETE | `/api/carrito/{idCarrito}/lineas/{idLineaCarrito}` | Elimina una linea                                            | `204 No Content`, `404 Not Found` |
| DELETE | `/api/carrito/{idCarrito}/lineas`                  | Vacia todas las lineas del carrito                           | `204 No Content`, `404 Not Found` |

![img.png](img.png)

## Ejemplos JSON

### Request para crear carrito (`POST /api/carrito`)
```json
{
  "idUsuario": 101,
  "correoUsuario": "alumno@comillas.edu"
}
```

### Response de carrito
```json
{
  "idCarrito": 1,
  "idUsuario": 101,
  "correoUsuario": "alumno@comillas.edu",
  "totalPrecio": 0.0
}
```

### Request para añadir linea (`POST /api/carrito/{idCarrito}/lineas`)
```json
{
  "idArticulo": 5001,
  "precioUnitario": 19.95,
  "numeroUnidades": 2
}
```

### Request para actualizar linea (`PUT /api/carrito/{idCarrito}/lineas/{idLineaCarrito}`)
```json
{
  "numeroUnidades": 4
}
```

### Response de linea
```json
{
  "idLineaCarrito": 3,
  "idCarrito": 1,
  "idArticulo": 5001,
  "precioUnitario": 19.95,
  "numeroUnidades": 4,
  "costeLineaArticulo": 79.8
}
```

## Tests incluidos
En `src/test/java` hay pruebas para validar la logica principal y el uso de `model` en la API:
- `servicio/CarritoServiceTest`: creacion, actualizacion y gestion de lineas, incluyendo el mantenimiento del total calculado.
- `entidad/LineaCarritoTest`: calculo de coste de linea.
- `controlador/CarritoControladorTest`: contrato HTTP basico usando DTOs de `model`.
- `Practica3ApplicationTests`: carga del contexto Spring.