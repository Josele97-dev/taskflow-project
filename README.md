# TaskFlow

TaskFlow es una aplicación web desarrollada con HTML, JavaScript y TailwindCSS que permite gestionar tareas de forma sencilla e intuitiva. 
Incluye categorías dinámicas, búsqueda, ordenación, modo oscuro y persistencia mediante localStorage.

## Funcionalidades

### Gestión de tareas

- Crear nuevas tareas con:
    - Texto
    - Prioridad (alta, media, baja)
    - Categoría
    - Fecha límite (opcional)

- Marcar tareas como **Pendiente** o **Hecha**

- Eliminar tareas individualmente

- Visualización clara con etiquetas de estado y prioridad

### Categorías dinámicas 

- Categorías base: Todas, Trabajo, Estudios, Personal

- El usuario puede:
  - Crear nuevas categorías
  - Eliminarlas (excepto las base)
  - Filtrar tareas por categoría

- Las categorías personalizadas se guardan en localStorage

### Búsqueda y ordenación

- Búsqueda en tiempo real por texto

- Ordenación por:

  - Orden de creación
  - Prioridad (alta → baja / baja → alta)
  - Orden alfabético
  - Estado (pendientes primero)

  ### Modo oscuro

- Interruptor para activar/desactivar modo oscuro

- Animación suave del botón

- Persistencia visual mediante clases Tailwind

### Persistencia local

- Todo se guarda automáticamente en localStorage:
  - Tareas
  - Categorías creadas por el usuario
  - Estado de cada tarea

### Tecnologías utilizadas

- HTML5

- JavaScript 

- TailwindCSS 

- Vercel

### Estructura del proyecto

TASKFLOW-PROJECT/
│
├── node_modules/
├── docs/
├── app.js
├── index.html
├── output.css
├── package-lock.json
├── package.json
├── README.md
├── styles.css
└── tailwind.config.js

### Cómo usar TaskFlow

1. Escribe una nueva tarea en el formulario superior.

2. Selecciona prioridad, categoría (puedes crear una nueva y cambiar las que salen por defecto) y fecha límite (opcional).

3. Pulsa "Añadir".

4. Filtra por categorías desde la barra lateral.

5. Busca tareas por texto en la barra de búsqueda.

6. Cambia el orden con el selector de ordenación.

7. Marca tareas como hechas o elimínalas.

