# TaskFlow

Aplicación web full-stack para la gestión de tareas. Desarrollada con HTML, JavaScript vanilla y TailwindCSS en el frontend, y Node.js + Express en el backend. Desplegada en Vercel con frontend y backend bajo un mismo dominio.

---

## Estructura del proyecto

```
TASKFLOW-PROJECT/
│
├── public/                  # Frontend estático
│   ├── index.html           # Estructura HTML principal
│   ├── app.js               # Lógica de la interfaz
│   ├── output.css           # CSS compilado por Tailwind
│   ├── styles.css           # Estilos base de Tailwind
│   └── api/
│       └── client.js        # Capa de red (fetch a la API)
│
├── server/                  # Backend Node.js
│   └── src/
│       ├── config/
│       │   └── env.js       # Carga y validación de variables de entorno
│       ├── controllers/
│       │   ├── task.controller.js
│       │   └── category.controller.js
│       ├── routes/
│       │   ├── task.routes.js
│       │   └── category.routes.js
│       ├── services/
│       │   ├── task.service.js
│       │   └── category.service.js
│       └── index.js         # Punto de entrada del servidor
│
├── docs/                    # Documentación
├── vercel.json              # Configuración de despliegue
├── package.json
└── README.md
```

---

## Stack técnico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Frontend | HTML5, JavaScript (ES Modules), TailwindCSS | Vanilla JS para mantener el proyecto sin dependencias de framework y con control total del DOM |
| Backend | Node.js, Express | Ligero, sin opiniones sobre arquitectura, adecuado para una API REST de este tamaño |
| Despliegue | Vercel (Serverless) | Permite servir frontend estático y backend Express bajo un mismo dominio sin configuración de servidor |
| Documentación API | Swagger (swagger-jsdoc + swagger-ui-express) | Generación automática de documentación desde anotaciones JSDoc en las rutas |
| Herramientas | dotenv, cors, nodemon | Variables de entorno, gestión de CORS y recarga automática en desarrollo |

---

## Arquitectura backend

El backend sigue una separación estricta de responsabilidades en tres capas:

### Rutas
Mapean cada URL y verbo HTTP al controlador correspondiente. No contienen lógica de negocio ni validaciones — su único propósito es el enrutamiento. Las anotaciones Swagger también se escriben aquí, junto a cada ruta, para mantener la documentación cerca de la definición del endpoint.

### Controladores
Extraen y validan los datos de la petición (`req.body`, `req.params`). Llaman a la capa de servicios y traducen el resultado a una respuesta HTTP con el código de estado correcto. Son la única capa que conoce Express — ninguna otra capa importa `req` ni `res`.

### Servicios
Contienen la lógica de negocio pura en JavaScript sin dependencias de Express ni HTTP. Lanzan errores semánticos (`NOT_FOUND`, `ALREADY_EXISTS`, `BASE_CATEGORY`) que los controladores capturan y traducen al código HTTP correspondiente. Esta separación permite testear la lógica de negocio de forma unitaria sin necesidad de levantar el servidor.

---

## Middlewares globales

- **`express.json()`**: Parsea el cuerpo de las peticiones y lo expone en `req.body`. Sin este middleware, `req.body` sería `undefined` en peticiones POST y PUT.
- **`cors()`**: Gestiona las cabeceras CORS (Cross-Origin Resource Sharing). Aunque en producción frontend y backend comparten dominio, se mantiene para desarrollo local donde corren en puertos distintos.
- **Manejador de errores**: Función de 4 parámetros `(err, req, res, next)` registrada al final del pipeline de Express. Actúa como red de seguridad para errores no capturados en los controladores: mapea `NOT_FOUND` a 404, `BAD_REQUEST` a 400, y cualquier otro error a 500 sin exponer detalles internos al cliente.

---

## Gestión de errores

Los errores se controlan en dos niveles:

**Controladores**: capturan explícitamente los errores semánticos lanzados por el servicio y devuelven el código HTTP específico con un mensaje descriptivo. Por ejemplo, `NOT_FOUND` al eliminar una tarea devuelve `404`, y `ALREADY_EXISTS` al crear una categoría devuelve `400`.

**Manejador global en `index.js`**: recoge cualquier error que no haya sido gestionado explícitamente en los controladores y devuelve un `500` genérico. Aunque los controladores actuales cubren todos los errores conocidos, el manejador global se mantiene como protección ante errores inesperados en futuras extensiones del código.

---

## Categorías base

Las categorías `Todas`, `Trabajo`, `Estudios` y `Personal` están definidas como constantes en dos niveles:

- **Frontend** (`app.js`): no renderiza el botón de eliminar para estas categorías, por lo que el usuario nunca puede intentar eliminarlas desde la interfaz.
- **Backend** (`category.service.js`): valida que el nombre no pertenezca a las categorías base antes de ejecutar la eliminación, lanzando `BASE_CATEGORY` si se intenta. El controlador lo traduce a un `400`.

Esta doble protección garantiza la integridad tanto desde la UI como a nivel de API, por si se realizan peticiones directas al endpoint saltándose el frontend.

---

## API REST

### Base URL

```
https://taskflow-project-eight.vercel.app/api/v1
```

### Tareas

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/tasks` | Obtener todas las tareas | `200 OK` |
| POST | `/tasks` | Crear una nueva tarea | `201 Created` |
| PUT | `/tasks/:id` | Actualizar una tarea | `200 OK` |
| DELETE | `/tasks/:id` | Eliminar una tarea | `204 No Content` |

### Categorías

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/categories` | Obtener todas las categorías | `200 OK` |
| POST | `/categories` | Crear una nueva categoría | `201 Created` |
| DELETE | `/categories/:nombre` | Eliminar una categoría | `204 No Content` |

### Códigos de error

| Código | Causa |
|--------|-------|
| `400 Bad Request` | Body inválido, campo obligatorio ausente, valor fuera de rango, categoría ya existente o categoría base |
| `404 Not Found` | Tarea o categoría no encontrada |
| `500 Internal Server Error` | Error interno no controlado |

La documentación interactiva completa de la API está disponible en [`/api-docs`](https://taskflow-project-eight.vercel.app/api-docs), generada automáticamente con Swagger a partir de las anotaciones JSDoc en los ficheros de rutas.

---

## Frontend

El frontend está desarrollado en JavaScript vanilla con ES Modules, sin frameworks. Esta decisión mantiene el proyecto libre de dependencias de terceros en el cliente y con control directo sobre el DOM.

La comunicación con la API está centralizada en `public/api/client.js`, que expone funciones asíncronas (`obtenerTareas`, `crearTarea`, `actualizarTarea`, `eliminarTarea`, `obtenerCategorias`, `crearCategoria`, `eliminarCategoria`). El resto de `app.js` consume estas funciones sin realizar llamadas `fetch` directas, desacoplando la lógica de UI de la capa de red. Cualquier cambio en la URL base o en los headers de la API solo requiere modificar `client.js`.

La URL base de la API está vacía (`BACKEND_URL = ''`) de forma intencionada: al estar frontend y backend desplegados bajo el mismo dominio en Vercel, todas las peticiones se resuelven de forma relativa sin necesidad de una URL absoluta.

---

## Despliegue en Vercel

Vercel sirve el proyecto como una combinación de frontend estático y función serverless:

- Las peticiones a rutas estáticas se resuelven desde `public/`.
- Las peticiones a `/api/*` se redirigen al servidor Express mediante la configuración de `vercel.json`.

Al compartir dominio, no se produce ninguna petición cross-origin en producción, lo que elimina problemas de CORS entre frontend y backend. El middleware `cors()` se mantiene únicamente para el entorno de desarrollo local.

URL: [https://taskflow-project-eight.vercel.app](https://taskflow-project-eight.vercel.app)

---

## Documentación adicional

- `docs/pruebas-integracion.md` — Pruebas de integración realizadas con Thunder Client sobre los endpoints desplegados
- API Docs (Swagger): [`/api-docs`](https://taskflow-project-eight.vercel.app/api-docs)
