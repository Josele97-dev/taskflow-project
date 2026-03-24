# Pruebas

## 1. Introducción

En esta fase se ha implementado un middleware global de manejo de errores en Express
y se han realizado pruebas de integración utilizando Thunder Client, incluyendo casos
correctos y errores intencionados (400, 404, 500).

## 2. Entorno de pruebas

- Herramienta de pruebas: Thunder Client (VS Code)
- Servidor: Node.js + Express
- URL base: [`https://taskflow-project-eight.vercel.app`](https://taskflow-project-eight.vercel.app)
- Ruta principal de la API: `/api/v1/tasks`

## 3. Pruebas de casos correctos con tareas

### 3.1. POST - Crear tarea

- Método: POST
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks`

**Resultado esperado:**
- Código: `201 Created`
- Cuerpo: tarea creada con id, texto, prioridad, categoria, fecha y completada

**Resultado obtenido:**
- Código: `201 Created`
- Cuerpo:
```json
{
    "id": "1773657987989",
    "texto": "Mi nueva tarea",
    "prioridad": "media",
    "categoria": "Personal",
    "fecha": null,
    "completada": false
}
```

### 3.2. GET – Obtener todas las tareas

- Método: GET  
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks`

**Resultado esperado:**
- Código: `200 OK`
- Cuerpo: lista de tareas (array JSON)

**Resultado obtenido:**
- Código: `200 OK`
- Cuerpo:
```json
[
    {
        "id": "1773657987989",
        "texto": "Mi nueva tarea",
        "prioridad": "media",
        "categoria": "Personal",
        "fecha": null,
        "completada": false
    }
]
```

### 3.3. PUT - Actualizar tarea

- Método: PUT
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks/1773657987989`

**Resultado esperado:**
- Código: `200 OK`
- Cuerpo: tarea actualizada con los nuevos valores

**Resultado obtenido:**
- Código: `200 OK`
- Cuerpo:
```json
{
    "id": "1773657987989",
    "texto": "Tarea actualizada",
    "prioridad": "media",
    "categoria": "Personal",
    "fecha": null,
    "completada": true
}
```

### 3.4. DELETE - Eliminar tarea

- Método: DELETE
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks/1773657987989`

**Resultado esperado:**
- Código: `204 No Content`

**Resultado obtenido:**
- Código: `204 No Content`

## 4. Pruebas con errores intencionados con tareas

### 4.1 POST sin body

- Método: POST
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks`

**Resultado:**
- Código: `400 Bad Request`
- Cuerpo:
```json
{
    "message": "El body es obligatorio y debe ser JSON"
}
```

### 4.2 POST sin texto

- Método: POST
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks`

**Resultado:**
- Código: `400 Bad Request`
- Cuerpo:
```json
{
    "message": "El campo texto es obligatorio y debe ser un string"
}
```

### 4.3 DELETE de tarea inexistente

- Método: DELETE
- URL: `https://taskflow-project-eight.vercel.app/api/v1/tasks/1111111`

**Resultado:**
- Código: `404 Not Found`
- Cuerpo:
```json
{
    "message": "Tarea no encontrada"
}
```
## 5. Pruebas de casos correctos con categorías

### 5.1. POST – Crear categoría

- Método: POST
- URL: https://taskflow-project-eight.vercel.app/api/v1/categories

**Resultado esperado:**

- Código: 201 CREATED
- Cuerpo: Categoría creada

**Resultado obtenido:**

- Código: `201 CREATED`
- Cuerpo:

```json

    {
        "nombre": "Compras"
    }

```

### 5.2. GET – Obtener todas las categorías

- Método: GET
- URL: https://taskflow-project-eight.vercel.app/api/v1/categories

**Resultado esperado:**

- Código: 200 OK
- Cuerpo: lista de categorías (base + creadas por el usuario)

**Resultado obtenido:**

- Código: `200 OK`
- Cuerpo:

```json
[
    "Todas",
    "Trabajo",
    "Estudios",
    "Personal",
    "Compras"
]
```

### 5.3. DELETE – Eliminar categoría

- Método: DELETE
- URL: https://taskflow-project-eight.vercel.app/api/v1/categories/Compras

**Resultado esperado:**

- Código: 204 No Content
- Cuerpo: (Vacío)

**Resultado obtenido:**

- Código: `204 No Content`
- Cuerpo: (Vacío)
