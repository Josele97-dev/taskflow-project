# Flujo de trabajo con Cursor

Aquí se documenta el uso de Cursor en el flujo de trabajo.

## Instalación de Cursor

1. Accede a Settings en Cursor.
2. Dirígete al apartado Tools & MCP.
3. Haz clic en Add Custom MCP.
4. Aparecerá un campo llamado mcpServers; allí debes instanciar el nombre de tu servidor.
5. Una vez instanciado el nombre, selecciona el type de servidor:

        - Filesystem → Para trabajar con archivos locales del proyecto.
        - GitHub → Para acceder a repositorios remotos y colaborar en equipo.

6. Escribe la ruta del proyecto o del repositorio según el tipo elegido:

        - Para Filesystem, indica la ruta local en tu ordenador.
        - Para GitHub, proporciona la URL del repositorio.

7. Guarda la configuración.

## Atajos de teclado más usados

A continuación se muestran los atajos de teclado más utilizados durante la ejecución del proyecto.

### Navegación

`Ctrl + P` → Buscar y abrir archivo rápidamente  
`Ctrl + Shift + P` → Abrir la paleta de comandos  
`Ctrl + B` → Mostrar / ocultar el explorador  

### Edición de código

`Ctrl + /` → Comentar o descomentar línea
`Ctrl + Shift + K` → Eliminar línea
`Ctrl + X` → Cortar línea o selección
`Ctrl + C` → Copiar línea o selección
`Ctrl + V` → Pegar línea o selección

### Buscar y reemplazar

`Ctrl + F` → Buscar en archivo  
`Ctrl + H` → Reemplazar  
`Ctrl + Shift + F` → Buscar en todo el proyecto  

### Atajos de IA

`Ctrl + K` → Editar código con IA  
`Ctrl + L` → Abrir chat con IA  
`Ctrl + Shift + Y` → Aplicar sugerencia de IA
`Tab` → Aceptar autocompletado de IA

## Mejoras del proyecto con Cursor

Más adelante se van a mostrar dos de las mejorar que ha proporciado Cursor con su sistema de IA al proyecto.

### Implementación de estado de tarea 

Mediante esta herramienta se ha podido crear una implementación que trata de ver el estado de una tarea creada, pudiendo estar en pendiente o hecha. El codigo aportado ha sido el siguiente:

```javascript
function agregarTarea(e) {
    e.preventDefault();
    const texto = input.value.trim();
    const prioridad = selectPrioridad.value;
    const categoria = selectCategoria.value;

    if (texto === '') return;

    const tarea = { 
        texto, 
        prioridad, 
        categoria, 
        completada: false   // ← Estado inicial de la tarea
    };

    tareas.push(tarea);
    guardarTareas();
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
    formulario.reset();
}
```
Aquí cuando se crea la tarea automáticamente está en estado de pendiente, que sería false. También se ha procedido a la creación del botón oportuno:

```javascript
const btnEstado = document.createElement('button');

btnEstado.className = `
    flex-none px-2 py-1 rounded-full text-white text-xs
    ${tarea.completada ? "bg-green-600" : "bg-gray-500"}
`;

btnEstado.textContent = tarea.completada ? "Hecha" : "Pendiente";

spanTextoYEstado.appendChild(btnEstado);
```
Y por último, el cambio de estado:

```javascript
btnEstado.addEventListener('click', () => {
    tarea.completada = !tarea.completada;
    guardarTareas();
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
});
```
### Refactorización categorías

Cursor ha realizado una mejora en el archivo JS al refactorizar la lógica de las categorías, al hacerlo más simple con toggle y condiciones. A continuación, se pueden observar los códigos:

Antes de refactorización:

```javascript
categorias.forEach(cat => {
    cat.addEventListener('click', () => {
        categorias.forEach(c => {
            c.classList.remove('bg-indigo-900', 'text-white');
            c.classList.add('bg-white', 'text-gray-800');
        });
        cat.classList.remove('bg-white', 'text-gray-800');
        cat.classList.add('bg-indigo-900', 'text-white');
        mostrarTareas(cat.dataset.category, inputBusqueda.value.trim());
    });
});
```

Refactorizado: 

```javascript
categorias.forEach(c => {
        c.classList.toggle('bg-indigo-900', c === cat);
        c.classList.toggle('text-white', c === cat);
        c.classList.toggle('bg-white', c !== cat);
        c.classList.toggle('text-gray-800', c !== cat);
    });

    mostrarTareas(cat.dataset.category, inputBusqueda.value.trim());
```

## Utilidad

El uso de Cursor junto con MCP permite que la IA trabaje con el contexto real del proyecto —archivos locales, repositorios remotos, bases de datos o APIs, lo que se traduce en mejoras claras tanto en productividad como en calidad y coherencia del código.

### Productividad y automatización 

- Genera código con mayor precisión al tener en cuenta la estructura completa del proyecto.
- Ofrece autocompletado contextual que reduce errores y agiliza el desarrollo.
- Facilita la creación de scripts y tareas repetitivas basadas en el estado actual del proyecto.

### Calidad y coherencia del código 

- Permite refactorizar con más seguridad al entender dependencias, imports y relaciones entre módulos.
- Ayuda a mantener tests y documentación al día cuando cambian las APIs internas.
- Sugiere soluciones que respetan las convenciones y el estilo del proyecto.

### Integración con servicios externos

- Conexión con bases de datos, APIs u otros servicios para generar consultas, modelos o endpoints ajustados al entorno real.
- Reduce errores lógicos al comprender cómo interactúan los distintos componentes del sistema.

### Trabajo colaborativo

- Mantiene el código alineado con el repositorio y con las aportaciones del resto del equipo.
- Evita inconsistencias entre módulos desarrollados por diferentes personas.













- En proyectos con muchos módulos, carpetas y dependencias, MCP permite que Cursor vea todo el proyecto. Así puede generar autocompletados más precisos, aplicar cambios en varios archivos y evitar errores de referencias.
- Puede integrarse con bases de datos, APIs u otros servicios, para generar código o consultas que estén en sintonía con el contexto real del proyecto.
- En trabajo colaborativo, ayuda a que el código sea consistente con el repositorio y las aportaciones de otros miembros del equipo.
- En refactorizaciones, permite hacer cambios seguros y coherentes sin romper dependencias.
- También puede ayudar a mantener tests y documentación actualizados junto con el código.
- Soporte para automatización: MCP puede permitir que Cursor genere scripts repetitivos o tareas automatizadas basadas en el contexto del proyecto, ahorrando tiempo.
- Mejora de consistencia de estilo: Si tu proyecto tiene normas de codificación o convenciones, Cursor puede sugerir código que las respete al entender todo el proyecto.
- Prevención de errores lógicos: Al tener visión global, puede sugerir soluciones que eviten errores de integración entre distintos módulos, APIs o bases de datos.