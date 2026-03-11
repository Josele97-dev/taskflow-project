const formulario = document.getElementById('formulario-tareas');
const input = document.getElementById('input-tarea');
const selectPrioridad = document.getElementById('input-prioridad');
const selectCategoria = document.getElementById('input-categoria');
const lista = document.getElementById('lista-tareas');
const categorias = document.querySelectorAll('#lista-categorias li');
const inputBusqueda = document.getElementById('input-busqueda');

let tareas = [];

document.addEventListener("DOMContentLoaded", () => {

    const button=document.getElementById("colorbtn");

    button.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        
    });

});

function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function crearTareaDOM(tarea) {
    const li = document.createElement('li');
    li.className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-200 p-3 rounded-md mt-3 transition-transform text-black transition-shadow duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md"
    li.dataset.category = tarea.categoria;

    const contenedorTexto = document.createElement('div');
    contenedorTexto.className = "flex-1";
    li.appendChild(contenedorTexto);

    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarea.texto;
    spanTexto.className = "block text-sm md:text-base text-gray-900 break-words break-all";
    contenedorTexto.appendChild(spanTexto);

    const spanCategoria = document.createElement('span');
    spanCategoria.textContent = tarea.categoria;
    spanCategoria.className = "block text-xs text-gray-600 mt-1";
    contenedorTexto.appendChild(spanCategoria);

    const contenedorMeta = document.createElement('div');
    contenedorMeta.className = "flex items-center flex-wrap gap-2 md:gap-0 md:justify-end w-full md:w-auto";
    li.appendChild(contenedorMeta);

    // Columna Estado (solo fija ancho en escritorio)
    const columnaEstado = document.createElement('div');
    columnaEstado.className = "flex justify-start md:justify-center md:w-28 mb-1 md:mb-0";
    contenedorMeta.appendChild(columnaEstado);

    const btnEstado = document.createElement('button');
    btnEstado.className = `
        px-3 py-1 rounded-full text-white text-xs font-semibold
        ${tarea.completada ? "bg-green-600" : "bg-gray-500"}
    `;
    btnEstado.textContent = tarea.completada ? "Hecha" : "Pendiente";
    columnaEstado.appendChild(btnEstado);

    btnEstado.addEventListener('click', () => {
        tarea.completada = !tarea.completada;
        guardarTareas();
        mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
    });

    // Columna Prioridad (solo fija ancho en escritorio)
    const columnaPrioridad = document.createElement('div');
    columnaPrioridad.className = "flex justify-start md:justify-center md:w-28 mb-1 md:mb-0";
    contenedorMeta.appendChild(columnaPrioridad);

    const spanPrioridad = document.createElement('span');
    spanPrioridad.className = `
        px-3 py-1 rounded-full text-white text-sm
        ${tarea.prioridad === "alta" ? "bg-red-500" :
          tarea.prioridad === "media" ? "bg-yellow-500" :
          "bg-green-500"}
    `;
    spanPrioridad.textContent = tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1);
    columnaPrioridad.appendChild(spanPrioridad);

    // Columna Acciones (solo fija ancho en escritorio)
    const columnaAcciones = document.createElement('div');
    columnaAcciones.className = "flex justify-start md:justify-center md:w-28";
    contenedorMeta.appendChild(columnaAcciones);

    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'Eliminar';
    btnBorrar.className = "cursor-pointer text-sm text-red-600 hover:text-red-800 transition-colors";
    columnaAcciones.appendChild(btnBorrar);

    btnBorrar.addEventListener('click', () => {
        tareas.splice(tareas.indexOf(tarea), 1);
        guardarTareas();
        mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
    });

    return li;
}

function getCategoriaActiva() { 
    const activa = document.querySelector('#lista-categorias li.bg-indigo-900');
    return activa ? activa.dataset.category : 'Todas';
}

function mostrarTareas(filtro = 'Todas', textoBusqueda = '') {
    lista.innerHTML = '';
    const busqueda = String(textoBusqueda ?? '').toLowerCase();
    const fragment = document.createDocumentFragment();

    for (const tarea of tareas) {
        const coincideCategoria = (filtro === 'Todas' || tarea.categoria === filtro);
        const coincideTexto = String(tarea.texto ?? '').toLowerCase().includes(busqueda);
        if (!coincideCategoria || !coincideTexto) continue;

        fragment.appendChild(crearTareaDOM(tarea));
    }

    lista.appendChild(fragment);
}

function cargarTareas() {
    let tareasGuardadas = [];
    try {
        tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    } catch {
        tareasGuardadas = [];
    }

    if (!Array.isArray(tareasGuardadas)) tareasGuardadas = [];

    tareas = tareasGuardadas.map(t => ({
        ...t,
        completada: typeof t.completada === 'boolean' ? t.completada : false
    }));
    mostrarTareas();
}

function agregarTarea(e) {
    e.preventDefault();
    const texto = input.value.trim();
    const prioridad = selectPrioridad.value;
    const categoria = selectCategoria.value;

    if (texto === '') return;

    const tarea = { texto, prioridad, categoria, completada: false };
    tareas.push(tarea);
    guardarTareas();
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
    formulario.reset();
}

formulario.addEventListener('submit', agregarTarea);

document.getElementById('lista-categorias').addEventListener('click', (e) => {
    const cat = e.target.closest('li[data-category]');
    if (!cat) return;

    if (cat.classList.contains('bg-indigo-900')) return;

    categorias.forEach(c => {
        c.classList.toggle('bg-indigo-900', c === cat);
        c.classList.toggle('text-white', c === cat);
        c.classList.toggle('bg-white', c !== cat);
        c.classList.toggle('text-gray-800', c !== cat);
    });

    mostrarTareas(cat.dataset.category, inputBusqueda.value.trim());
});

inputBusqueda.addEventListener('input', () => {
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
});

cargarTareas();