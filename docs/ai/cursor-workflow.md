# Flujo de trabajo con Cursor

Aquí se documenta el uso de Cursor en el flujo de trabajo.

## Atajos de teclado más usados

A continuación se muestran los atajos de teclado más utilizados durante la ejecución del proyecto.

### Navegación
`Ctrl + P` → Buscar y abrir archivo rápidamente  
`Ctrl + Shift + P` → Abrir la paleta de comandos  
`Ctrl + B` → Mostrar / ocultar el explorador  

### Edición de código
`Ctrl + /` → Comentar o descomentar línea  
`Ctrl + Shift + K` → Eliminar línea  

### Buscar y reemplazar
`Ctrl + F` → Buscar en archivo  
`Ctrl + H` → Reemplazar  
`Ctrl + Shift + F` → Buscar en todo el proyecto  

### Atajos de IA
`Ctrl + K` → Editar código con IA  
`Ctrl + L` → Abrir chat con IA  
`Ctrl + Enter` → Aplicar sugerencia de IA  
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

