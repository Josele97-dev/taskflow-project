# TaskFlow

Aplicación web de gestión de tareas con frontend ligero y backend. Permite organizar tareas por categorías, gestionar prioridades y mantener un flujo de trabajo limpio y sencillo.

**Demo en producción**: [taskflow-project-eight.vercel.app](https://taskflow-project-eight.vercel.app)  
**Documentación de la API**: [/api-docs](https://taskflow-project-eight.vercel.app/api/v1/api-docs/)

---

## ¿Qué hace la aplicación?

- Crear, editar y eliminar tareas con título, prioridad, categoría y fecha (opcional).
- Filtrar tareas por categoría (predefinidas y personalizadas)
- Gestionar categorías propias: crear y eliminar las que no sean de sistema
- Interfaz responsive

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, JavaScript (ES Modules), TailwindCSS |
| Backend | Node.js, Express |
| Despliegue | Vercel (Serverless) |
| Documentación API | Swagger (swagger-jsdoc + swagger-ui-express) |

---

## Estructura del proyecto

```
TASKFLOW-PROJECT/
│
├── public/               # Frontend estático
│   ├── index.html
│   ├── app.js
│   ├── output.css
│   ├── styles.css
│   └── api/
│       └── client.js     # Capa de red: todas las llamadas fetch a la API
│
├── server/               # Backend Node.js + Express
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       └── services/
│
├── docs/                 # Pruebas de integración
├── vercel.json           # Configuración de despliegue
└── package.json
```

> La documentación técnica detallada del backend se encuentra en [`server/README.md`](./server/README.md).

---

## Despliegue 

El proyecto está desplegado en **Vercel** como una combinación de frontend estático y función serverless:

- Las rutas estáticas se sirven desde `public/`
- Las peticiones a `/api/*` se redirigen al servidor Express

Frontend y backend comparten dominio. La configuración completa está en [`vercel.json`](./vercel.json).

---

## Despliegue en local

Este documento explica cómo ejecutar **TaskFlow** en tu máquina local levantando backend y frontend por separado.

### Backend

1.  Abre una terminal y entra en la carpeta del servidor:

``` bash
cd server
```

2.  Instala las dependencias:

``` bash
npm install
```

3.  Levanta el servidor en modo desarrollo:

``` bash
npm run dev
```

El backend quedará disponible en `http://localhost:3000`.

---

### Frontend

1.  En `public/api/client.js`, sustituye temporalmente la URL del
    backend por:

``` js
const BACKEND_URL = 'http://localhost:3000';
```

2.  Instala la extensión **Live Server** en VS Code.

3.  Abre `index.html` con la opción **Open with Live Server**.

---

Con esto, tanto backend como frontend estarán funcionando en tu máquina y podrás trabajar con TaskFlow en local sin problemas.


## Documentación adicional

- [`server/README.md`](./server/README.md) — Arquitectura, diseño y decisiones técnicas del backend
- [`docs/pruebas-integracion.md`](./docs/pruebas-integracion.md) — Pruebas de integración realizadas con Thunder Client
- [docs/ai/] — Reflexiones y experimentos sobre el uso de IA durante el desarrollo (ai compartison, prompt engineering, cursos workflow, experiments, reflection)
- [Swagger UI](https://taskflow-project-eight.vercel.app/api-docs) — Referencia interactiva de todos los endpoints