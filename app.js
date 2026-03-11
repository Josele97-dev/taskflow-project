// DOM
const formTareas = document.getElementById('formulario-tareas');
const inputTarea = document.getElementById('input-tarea');
const selectPrioridad = document.getElementById('input-prioridad');
const selectCategoria = document.getElementById('input-categoria');
const listaTareas = document.getElementById('lista-tareas');
const itemsCategorias = document.querySelectorAll('#lista-categorias li');
const inputBusqueda = document.getElementById('input-busqueda');
const btnTema = document.getElementById('colorbtn');

// Estado
let tareas = [];

/**
 * Persiste la lista de tareas en localStorage.
 * @param {Array<object>} [nextTareas=tareas] Lista a persistir (por defecto el estado actual).
 * @returns {void}
 */
function guardarTareas(nextTareas = tareas) {
    localStorage.setItem('tareas', JSON.stringify(nextTareas));
}

/**
 * Convierte un valor a string y elimina espacios alrededor.
 * @param {unknown} valor
 * @returns {string}
 */
function normalizarTexto(valor) {
    return String(valor ?? '').trim();
}

/**
 * Obtiene el texto de búsqueda actual normalizado.
 * @returns {string}
 */
function getTextoBusquedaActual() {
    return normalizarTexto(inputBusqueda.value).toLowerCase();
}

/**
 * Re-renderiza la lista usando categoría activa y búsqueda actual.
 * @returns {void}
 */
function renderActual() {
    mostrarTareas(getCategoriaActiva(), getTextoBusquedaActual());
}

/**
 * Crea el elemento `<li>` para una tarea, incluyendo listeners de estado y eliminación.
 * @param {{texto:string, prioridad:string, categoria:string, completada:boolean}} tarea
 * @returns {HTMLLIElement}
 */
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

    const btnToggleEstado = document.createElement('button');
    btnToggleEstado.className = `
        px-3 py-1 rounded-full text-white text-xs font-semibold
        ${tarea.completada ? "bg-green-600" : "bg-gray-500"}
    `;
    btnToggleEstado.textContent = tarea.completada ? "Hecha" : "Pendiente";
    columnaEstado.appendChild(btnToggleEstado);

    btnToggleEstado.addEventListener('click', () => {
        tarea.completada = !tarea.completada;
        guardarTareas();
        renderActual();
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

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = "cursor-pointer text-sm text-red-600 hover:text-red-800 transition-colors";
    columnaAcciones.appendChild(btnEliminar);

    btnEliminar.addEventListener('click', () => {
        const idx = tareas.indexOf(tarea);
        if (idx !== -1) tareas.splice(idx, 1);
        guardarTareas();
        renderActual();
    });

    return li;
}

/**
 * Devuelve la categoría seleccionada en el sidebar.
 * @returns {string} Categoría activa o 'Todas' si no hay selección.
 */
function getCategoriaActiva() { 
    const activa = document.querySelector('#lista-categorias li.bg-indigo-900[data-category]');
    return activa?.dataset?.category ?? 'Todas';
}

/**
 * Renderiza las tareas filtrando por categoría y texto.
 * @param {string} [filtro='Todas']
 * @param {string} [textoBusqueda='']
 * @returns {void}
 */
function mostrarTareas(filtro = 'Todas', textoBusqueda = '') {
    listaTareas.innerHTML = '';
    const busqueda = String(textoBusqueda ?? '').toLowerCase();
    const fragment = document.createDocumentFragment();

    for (const tarea of tareas) {
        const coincideCategoria = (filtro === 'Todas' || tarea.categoria === filtro);
        const coincideTexto = String(tarea.texto ?? '').toLowerCase().includes(busqueda);
        if (!coincideCategoria || !coincideTexto) continue;

        fragment.appendChild(crearTareaDOM(tarea));
    }

    listaTareas.appendChild(fragment);
}

/**
 * Carga tareas desde localStorage y actualiza el estado en memoria.
 * @returns {void}
 */
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
    renderActual();
}

/**
 * Handler del submit: crea una tarea a partir del formulario.
 * @param {SubmitEvent} e
 * @returns {void}
 */
function agregarTarea(e) {
    e.preventDefault();
    const texto = String(inputTarea.value ?? '').trim();
    const prioridad = selectPrioridad.value;
    const categoria = selectCategoria.value;

    if (texto === '') return;

    tareas.push({ texto, prioridad, categoria, completada: false });
    guardarTareas();
    renderActual();
    formTareas.reset();
}

/**
 * Inicializa listeners y carga inicial de tareas.
 * @returns {void}
 */
function initApp() {
    btnTema?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });

    formTareas.addEventListener('submit', agregarTarea);

    document.getElementById('lista-categorias').addEventListener('click', (e) => {
        const cat = e.target.closest('li[data-category]');
        if (!cat) return;
        if (cat.classList.contains('bg-indigo-900')) return;

        itemsCategorias.forEach(item => {
            item.classList.toggle('bg-indigo-900', item === cat);
            item.classList.toggle('text-white', item === cat);
            item.classList.toggle('bg-white', item !== cat);
            item.classList.toggle('text-gray-800', item !== cat);
        });

        mostrarTareas(cat.dataset.category, getTextoBusquedaActual());
    });

    inputBusqueda.addEventListener('input', () => {
        renderActual();
    });

    cargarTareas();
}

initApp();