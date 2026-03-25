# TaskFlow — Backend

Servidor REST desarrollado con Node.js y Express. Gestiona tareas y categorías con una arquitectura en tres capas (rutas, controladores, servicios) y se despliega como función serverless en Vercel.

---

## Estructura del directorio

```
server/
└── src/
    ├── config/
    │   └── env.js                # Carga y validación de variables de entorno
    ├── controllers/
    │   ├── task.controller.js    # Controlador de tareas
    │   └── category.controller.js
    ├── routes/
    │   ├── task.routes.js        # Rutas de tareas + anotaciones Swagger
    │   └── category.routes.js
    ├── services/
    │   ├── task.service.js       # Lógica de negocio de tareas
    │   └── category.service.js
    └── index.js                  # Punto de entrada: middlewares, rutas, servidor
```

---

## Arquitectura

El backend aplica una separación estricta de responsabilidades en tres capas. Cada capa tiene un propósito único y no cruza sus límites hacia las demás.

### Rutas

Mapean cada URL y verbo HTTP al controlador correspondiente. No contienen lógica de negocio ni validaciones — su único propósito es el enrutamiento. Las anotaciones Swagger se escriben aquí, junto a cada ruta, para mantener la documentación cerca de la definición del endpoint.

### Controladores

Extraen y validan los datos de la petición (`req.body`, `req.params`). Llaman a la capa de servicios y traducen el resultado a una respuesta HTTP con el código de estado correcto. Son la única capa que conoce Express — ninguna otra capa importa `req` ni `res`.

### Servicios

Contienen la lógica de negocio pura en JavaScript, sin dependencias de Express ni de HTTP. Lanzan errores semánticos (`NOT_FOUND`, `ALREADY_EXISTS`, `BASE_CATEGORY`) que los controladores capturan y traducen al código HTTP correspondiente. Esta separación permite testear la lógica de negocio de forma unitaria sin necesidad de levantar el servidor.

```
Petición HTTP
     │
     ▼
  [Ruta]  →  enruta hacia el controlador correcto
     │
     ▼
[Controlador]  →  valida entrada, llama al servicio, forma la respuesta HTTP
     │
     ▼
  [Servicio]  →  ejecuta la lógica de negocio, lanza errores semánticos
```

---

## Middlewares globales

Registrados en `index.js` antes de las rutas:

| Middleware | Propósito |
|------------|-----------|
| `express.json()` | Parsea el cuerpo de las peticiones y lo expone en `req.body`. Sin este middleware, `req.body` sería `undefined` en peticiones POST y PUT. |
| `cors()` | Gestiona las cabeceras CORS. En producción frontend y backend comparten dominio, por lo que no produce peticiones cross-origin. Se mantiene para el entorno de desarrollo local, donde corren en puertos distintos. |
| Manejador de errores | Función de 4 parámetros `(err, req, res, next)` registrada al final del pipeline. Actúa como red de seguridad para errores no capturados en los controladores. |

---

## Gestión de errores

Los errores se controlan en dos niveles:

**Controladores** — capturan explícitamente los errores semánticos lanzados por el servicio y devuelven el código HTTP específico con un mensaje descriptivo:

| Error semántico | Código HTTP | Ejemplo |
|-----------------|-------------|---------|
| `NOT_FOUND` | `404` | Tarea o categoría inexistente |
| `ALREADY_EXISTS` | `400` | Categoría duplicada |
| `BASE_CATEGORY` | `400` | Intento de eliminar una categoría del sistema |

**Manejador global en `index.js`** — recoge cualquier error que no haya sido gestionado explícitamente en los controladores y devuelve un `500` genérico sin exponer detalles internos al cliente. Aunque los controladores actuales cubren todos los errores conocidos, el manejador global se mantiene como protección ante errores inesperados en futuras extensiones del código.

---

## Categorías base

Las categorías `Todas`, `Trabajo`, `Estudios` y `Personal` son categorías de sistema que no pueden eliminarse. Esta restricción se aplica en dos niveles:

**Frontend** (`app.js`) — no renderiza el botón de eliminar para estas categorías, por lo que el usuario nunca puede intentar eliminarlas desde la interfaz.

**Backend** (`category.service.js`) — valida que el nombre no pertenezca a las categorías base antes de ejecutar la eliminación, lanzando `BASE_CATEGORY` si se intenta. El controlador lo traduce a un `400 Bad Request`.

Esta doble protección garantiza la integridad tanto desde la UI como a nivel de API, cubriendo el caso de peticiones directas al endpoint que se salten el frontend.

---

## API REST

### Base URL

```
https://taskflow-project-eight.vercel.app/api/v1

```

### Tareas

| Método | Endpoint | Descripción | Respuesta exitosa |
|--------|----------|-------------|-------------------|
| `GET` | `/tasks` | Obtener todas las tareas | `200 OK` |
| `POST` | `/tasks` | Crear una nueva tarea | `201 Created` |
| `PUT` | `/tasks/:id` | Actualizar una tarea existente | `200 OK` |
| `DELETE` | `/tasks/:id` | Eliminar una tarea | `204 No Content` |

### Categorías

| Método | Endpoint | Descripción | Respuesta exitosa |
|--------|----------|-------------|-------------------|
| `GET` | `/categories` | Obtener todas las categorías | `200 OK` |
| `POST` | `/categories` | Crear una nueva categoría | `201 Created` |
| `DELETE` | `/categories/:nombre` | Eliminar una categoría | `204 No Content` |

### Códigos de error

| Código | Causa |
|--------|-------|
| `400 Bad Request` | Body inválido, campo obligatorio ausente, valor fuera de rango, categoría ya existente o categoría base |
| `404 Not Found` | Tarea o categoría no encontrada |
| `500 Internal Server Error` | Error interno no controlado |

La documentación interactiva completa está disponible en [`/api-docs`](https://taskflow-project-eight.vercel.app/api-docs), generada automáticamente con Swagger a partir de las anotaciones JSDoc en los ficheros de rutas.

---

## Stack y dependencias

| Paquete | Rol |
|---------|-----|
| `express` | Framework HTTP |
| `cors` | Gestión de cabeceras CORS |
| `dotenv` | Carga de variables de entorno desde `.env` |
| `swagger-jsdoc` | Generación del esquema OpenAPI desde anotaciones JSDoc |
| `swagger-ui-express` | Sirve la documentación interactiva en `/api-docs` |
| `nodemon` | Recarga automática del servidor en desarrollo |

---

## Despliegue

El servidor se despliega en Vercel como una función serverless. La configuración en `vercel.json` (en la raíz del proyecto) redirige todas las peticiones a `/api/*` hacia el servidor Express, mientras que el resto de rutas se resuelven como frontend estático desde `public/`.
