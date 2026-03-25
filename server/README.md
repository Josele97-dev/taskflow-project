# TaskFlow — Backend

Servidor REST desarrollado con Node.js y Express. Gestiona tareas y categorías con una arquitectura en tres capas (rutas, controladores, servicios) y se despliega como función serverless en Vercel.

---

## Índice

1. [Estructura del directorio](#estructura-del-directorio)
2. [Arquitectura](#arquitectura)
   - [Rutas](#rutas)
   - [Controladores](#controladores)
   - [Servicios](#servicios)
3. [Middlewares globales](#middlewares-globales)
4. [Orden de ejecución de middlewares](#orden-de-ejecución-de-middlewares)
5. [Gestión de errores](#gestión-de-errores)
6. [Categorías base](#categorías-base)
7. [Modelo de datos](#modelo-de-datos)
   - [Tarea (servidor)](#tarea-servidor)
   - [Tarea (frontend)](#tarea-frontend)
   - [Normalización de prioridades](#normalización-de-prioridades)
8. [API REST](#api-rest)
   - [Tareas](#tareas)
   - [Categorías](#categorías)
9. [Ejemplos de peticiones reales (curl)](#ejemplos-de-peticiones-reales-curl)
   - [Obtener todas las tareas](#obtener-todas-las-tareas)
   - [Categorías](#categorías-1)
10. [Ejemplos de implementación](#ejemplos-de-implementación)
11. [Códigos de error](#códigos-de-error)
12. [Stack y dependencias](#stack-y-dependencias)
13. [Despliegue](#despliegue)


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
Mapean cada URL y verbo HTTP al controlador correspondiente. No contienen lógica de negocio ni validaciones — su único propósito es el enrutamiento.

### Controladores
Extraen y validan los datos de la petición (`req.body`, `req.params`). Llaman a la capa de servicios y traducen el resultado a una respuesta HTTP con el código de estado correcto.

### Servicios
Contienen la lógica de negocio pura en JavaScript, sin dependencias de Express ni de HTTP. Lanzan errores semánticos (`NOT_FOUND`, `ALREADY_EXISTS`, `BASE_CATEGORY`) que los controladores capturan y traducen al código HTTP correspondiente.

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
| `express.json()` | Parsea el cuerpo de las peticiones y lo expone en `req.body`. |
| `cors()` | Gestiona las cabeceras CORS. |
| Manejador de errores | Función de 4 parámetros `(err, req, res, next)` registrada al final del pipeline. |

---

## Orden de ejecución de middlewares

1. **cors()**  
2. **express.json()**  
3. **Swagger UI (`/api/v1/api-docs`)**  
4. **Swagger JSON (`/api/v1/swagger.json`)**  
5. **Rutas principales de la API**  
6. **Ruta raíz (`/`)**  
7. **Middleware global de errores**  
8. **Inicio del servidor (`app.listen`)**  

---

## Gestión de errores

| Error semántico | Código HTTP | Ejemplo |
|-----------------|-------------|---------|
| `NOT_FOUND` | `404` | Tarea o categoría inexistente |
| `ALREADY_EXISTS` | `400` | Categoría duplicada |
| `BASE_CATEGORY` | `400` | Intento de eliminar una categoría del sistema |

El manejador global captura cualquier error no gestionado y devuelve un `500` genérico sin exponer detalles internos.

---

## Categorías base

Las categorías `Todas`, `Trabajo`, `Estudios` y `Personal` son categorías de sistema que no pueden eliminarse. Esta restricción se aplica en dos niveles:

**Frontend** — no muestra el botón de eliminar para estas categorías, evitando que el usuario pueda intentar borrarlas desde la interfaz.

**Backend** — valida en `category.service.js` que el nombre no pertenezca a las categorías base antes de ejecutar la eliminación.  
Si se intenta borrar una, el servicio lanza `BASE_CATEGORY` y el controlador devuelve:

```json
{ "message": "No se puede eliminar una categoría base del sistema" }
```

Esta doble protección garantiza la integridad del sistema incluso ante peticiones directas a la API.

---

## Modelo de datos

### Tarea (servidor)

```json
{
  "id": "1732538294000",
  "texto": "Estudiar para el examen",
  "prioridad": "alta",
  "categoria": "Personal",
  "fecha": null,
  "completada": false
}
```

### Tarea (frontend)

```json
{
  "id": "1732538294000",
  "text": "Estudiar para el examen",
  "priority": "high",
  "category": "Personal",
  "completed": false
}
```

### Normalización de prioridades

| Frontend envía | Servidor guarda | Frontend recibe |
|----------------|------------------|------------------|
| `"high"`       | `"alta"`         | `"high"`         |
| `"medium"`     | `"media"`        | `"medium"`       |
| `"low"`        | `"baja"`         | `"low"`          |

---

## API REST

### Base URL

```
https://taskflow-project-eight.vercel.app/api/v1
```

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tasks` | Obtener todas las tareas |
| `POST` | `/tasks` | Crear una nueva tarea |
| `PUT` | `/tasks/:id` | Actualizar una tarea existente |
| `DELETE` | `/tasks/:id` | Eliminar una tarea |

### Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/categories` | Obtener todas las categorías |
| `POST` | `/categories` | Crear una nueva categoría |
| `DELETE` | `/categories/:nombre` | Eliminar una categoría |

---

# Ejemplos de peticiones reales (curl)

Todas las peticiones usan la URL base:

```
https://taskflow-project-eight.vercel.app/api/v1
```

---

## Obtener todas las tareas

```bash
curl https://taskflow-project-eight.vercel.app/api/v1/tasks
```

---

## Crear una tarea

```bash
curl -X POST https://taskflow-project-eight.vercel.app/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"texto": "Revisar código", "prioridad": "alta", "categoria": "Trabajo"}'
```

---

## Crear una tarea sin texto

```bash
curl -X POST https://taskflow-project-eight.vercel.app/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Actualizar una tarea

```bash
curl -X PUT https://taskflow-project-eight.vercel.app/api/v1/tasks/1732539000000 \
  -H "Content-Type: application/json" \
  -d '{"texto": "Revisar código actualizado", "prioridad": "media"}'
```

---

## Eliminar una tarea

```bash
curl -X DELETE https://taskflow-project-eight.vercel.app/api/v1/tasks/1732539000000
```

---

## Categorías

### Obtener todas las categorías

```bash
curl https://taskflow-project-eight.vercel.app/api/v1/categories
```

### Crear una categoría

```bash
curl -X POST https://taskflow-project-eight.vercel.app/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Hogar"}'
```

### Eliminar una categoría

```bash
curl -X DELETE https://taskflow-project-eight.vercel.app/api/v1/categories/Hogar
```

---

## Ejemplos de implementación

### Ruta documentada con Swagger

```js
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *               prioridad:
 *                 type: string
 *               categoria:
 *                 type: string
 *               fecha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', taskController.crearTarea);
```

### Controlador con validación y manejo de errores

```js
function crearTarea(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: 'El body es obligatorio y debe ser JSON' });
  }

  const { texto, prioridad, categoria, fecha } = req.body;

  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({ message: 'El campo texto es obligatorio y debe ser un string' });
  }

  const prioridadesValidas = ['alta', 'media', 'baja'];
  if (prioridad !== undefined && !prioridadesValidas.includes(prioridad)) {
    return res.status(400).json({ message: 'La prioridad debe ser alta, media o baja' });
  }

  try {
    const nuevaTarea = taskService.crearTarea({ texto, prioridad, categoria, fecha });
    return res.status(201).json(nuevaTarea);
  } catch (error) {
    if (error.message === 'ALREADY_EXISTS') {
      return res.status(400).json({ message: 'Ya existe una tarea con el mismo título, prioridad y categoría' });
    }
    return next(error);
  }
}
```

### Servicio con lógica pura

```js
let tasks = [];

function crearTarea(data) {
  const duplicada = tasks.some(t =>
    t.texto.toLowerCase() === data.texto.toLowerCase() &&
    t.categoria === data.categoria &&
    t.prioridad === data.prioridad
  );

  if (duplicada) {
    throw new Error('ALREADY_EXISTS');
  }

  const nuevaTarea = {
    id: Date.now().toString(),
    texto: data.texto,
    prioridad: data.prioridad || 'media',
    categoria: data.categoria || 'Personal',
    fecha: data.fecha || null,
    completada: false
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
}
```

---

### 🚦 Códigos de error

| Código | Causa |
|--------|-------|
| `400 Bad Request` | Body inválido, campo obligatorio ausente, valor fuera de rango, categoría ya existente o categoría base |
| `404 Not Found` | Tarea o categoría no encontrada |
| `500 Internal Server Error` | Error interno no controlado |

Ejemplos de respuestas:

```json
// Recurso no encontrado
{ "message": "Recurso no encontrado" }

// Categoría duplicada
{ "message": "La categoría ya existe" }

// Categoría base protegida
{ "message": "No se puede eliminar una categoría base del sistema" }
```

---

## Stack y dependencias

| Paquete | Rol |
|---------|-----|
| `express` | Framework HTTP |
| `cors` | Gestión de cabeceras CORS |
| `dotenv` | Carga de variables de entorno |
| `swagger-jsdoc` | Generación del esquema OpenAPI |
| `swagger-ui-express` | Documentación interactiva |
| `nodemon` | Recarga automática en desarrollo |

---

## Despliegue

El servidor se despliega en Vercel como una función serverless.  
La configuración en `vercel.json` redirige todas las peticiones a `/api/*` hacia el servidor Express.
