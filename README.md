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

### Ejemplos de uso

  #### Crear una tarea básica
  
  1. Escribe en el campo “Nueva tarea”:
     Preparar presentación del proyecto

  2. Selecciona prioridad:
     Alta

  3. Selecciona categoría:
     Trabajo

  4. (Opcional) Selecciona fecha límite:
      2025-09-28

  5. Pulsa Añadir

  La tarea aparecerá en la lista con estado “Pendiente” y prioridad alta. Además informará de la categoría de la tarea que es trabajo y su fecha límite marcada que es 2025-09-28

  #### Crear una categoría personalizada

  1. En la barra lateral, escribe en “Nueva categoría”:
     Compras

  2. Pulsar Enter o el botón +

  3. La categoría aparecerá en la lista y en el selector del formulario.

  #### Filtrar tareas por categoría
  
  1. Haz clic en una categoría, por ejemplo:
     Estudios

  2. Solo se mostrarán las tareas asociadas a esa categoría.

  #### Buscar tareas por texto
  
  1. En el campo “Buscar tareas…”, escribe:
     Examen

  2. La lista se actualizará mostrando solo las tareas que contengan esa palabra.

  #### Ordenar tareas

  1. En el selector de ordenación, elige:
  Prioridad (alta → baja)

  2. Las tareas se reorganizarán automáticamente.

  #### Marcar una tarea como hecha

  1. Pulsa el botón “Pendiente” en la tarea.

  2. Cambiará a “Hecha”.

  #### Eliminar una tarea

  1. Pulsa el botón “Eliminar” en la tarea deseada.

  2. La tarea desaparecerá de la lista y del almacenamiento local.

