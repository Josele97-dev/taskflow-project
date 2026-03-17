// DOM
const formTareas = document.getElementById('formulario-tareas');
const inputTarea = document.getElementById('input-tarea');
const selectPrioridad = document.getElementById('input-prioridad');
const selectCategoria = document.getElementById('input-categoria');
const inputFecha = document.getElementById('input-fecha');
const listaTareas = document.getElementById('lista-tareas');
const inputBusqueda = document.getElementById('input-busqueda');
const selectOrden = document.getElementById('input-orden');
const btnTema = document.getElementById('colorbtn');

// Categorías dinámicas
const listaCategorias = document.getElementById('lista-categorias');
const inputNuevaCategoria = document.getElementById('input-nueva-categoria');
const btnAgregarCategoria = document.getElementById('btn-agregar-categoria');

// Categorías base que NO se pueden eliminar
const categoriasBase = ["Todas", "Trabajo", "Estudios", "Personal"];

// Estado
let tareas = [];
let categoriasUsuario = [];
let criterioOrdenActual = 'creacion';

// ------------------------------
// Persistencia
// ------------------------------

/**
 * Guarda la lista de tareas en localStorage.
 * @param {Array} nextTareas - Lista de tareas a guardar.
 */
function guardarTareas(nextTareas = tareas) {
    localStorage.setItem('tareas', JSON.stringify(nextTareas));
}

/**
 * Guarda las categorías creadas por el usuario en localStorage.
 */
function guardarCategorias() {
    localStorage.setItem('categoriasUsuario', JSON.stringify(categoriasUsuario));
}

/**
 * Carga las categorías del usuario desde localStorage.
 */
function cargarCategorias() {
    const raw = localStorage.getItem('categoriasUsuario');
    try {
        categoriasUsuario = raw ? JSON.parse(raw) : [];
    } catch {
        categoriasUsuario = [];
    }
}

// ------------------------------
// Utilidades
// ------------------------------

/**
 * Normaliza un texto eliminando espacios y valores nulos.
 * @param {string} valor - Texto a normalizar.
 * @returns {string} Texto limpio.
 */
function normalizarTexto(valor) {
    return String(valor ?? '').trim();
}

/**
 * Obtiene el texto actual del campo de búsqueda en minúsculas.
 * @returns {string} Texto de búsqueda.
 */
function getTextoBusquedaActual() {
    return normalizarTexto(inputBusqueda.value).toLowerCase();
}

/**
 * Renderiza la lista de tareas según categoría y búsqueda.
 */
function renderActual() {
    mostrarTareas(getCategoriaActiva(), getTextoBusquedaActual());
    actualizarContador()
}

/**
 * Actualiza el contador de tareas pendientes en la cabecera.
 * Muestra "¡Sin tareas!" si no hay pendientes, o el número de pendientes en caso contrario.
 */
function actualizarContador() {
    const pendientes = tareas.filter(t => !t.completada).length;
    const contador = document.getElementById('contador-pendientes');
    if (!contador) return;

    if (pendientes === 0) {
        contador.textContent = "✅ ¡Sin tareas!";
    } else {
        contador.textContent = `⏳ ${pendientes} tarea${pendientes === 1 ? '' : 's'} pendiente${pendientes === 1 ? '' : 's'}`;
    }
}

// ------------------------------
// Ordenar tareas
// ------------------------------

/**
 * Ordena una lista de tareas según el criterio seleccionado.
 * @param {Array} lista - Lista de tareas.
 * @returns {Array} Lista ordenada.
 */
function ordenarTareas(lista) {
    if (criterioOrdenActual === 'creacion') return lista;

    const copia = [...lista];

    if (criterioOrdenActual === 'prioridad') {
        const pesoPrioridad = { alta: 0, media: 1, baja: 2 };
        copia.sort((a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad]);
    } 
    else if (criterioOrdenActual === 'prioridad-inversa') {
        const pesoPrioridad = { baja: 0, media: 1, alta: 2 };
        copia.sort((a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad]);
    }
    else if (criterioOrdenActual === 'texto') {
        copia.sort((a, b) =>
            normalizarTexto(a.texto).localeCompare(
                normalizarTexto(b.texto),
                'es',
                { sensitivity: 'base' }
            )
        );
    }
    else if (criterioOrdenActual === 'texto-inverso') {
        copia.sort((a, b) =>
            normalizarTexto(b.texto).localeCompare(
                normalizarTexto(a.texto),
                'es',
                { sensitivity: 'base' }
            )
        );
    }
    else if (criterioOrdenActual === 'estado') {
        copia.sort((a, b) => (a.completada === b.completada ? 0 : a.completada ? 1 : -1));
    }

    return copia;
}


// ------------------------------
// Crear DOM de tarea
// ------------------------------

/**
 * Crea y devuelve el elemento HTML que representa una tarea.
 * @param {Object} tarea - Objeto con los datos de la tarea.
 * @returns {HTMLElement} Elemento <li> con la tarea.
 */
function crearTareaDOM(tarea) {
    const li = document.createElement('li');
    li.className = "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-200 p-3 rounded-md mt-3 transition-transform text-black hover:scale-[1.02] hover:shadow-md";
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

    if (tarea.fecha) {
        const spanFecha = document.createElement('span');
        spanFecha.textContent = `Fecha límite: ${tarea.fecha}`;
        spanFecha.className = "block text-xs text-gray-500 mt-0.5";
        contenedorTexto.appendChild(spanFecha);
    }

    const contenedorMeta = document.createElement('div');
contenedorMeta.className = "flex items-center flex-wrap gap-2 md:gap-4 md:justify-end w-full md:w-auto";
li.appendChild(contenedorMeta);

// Columna del estado
const columnaEstado = document.createElement('div');
columnaEstado.className = "flex justify-start md:justify-center md:w-24 mb-1 md:mb-0";
contenedorMeta.appendChild(columnaEstado);

// Botón de estado intuitivo
const btnToggleEstado = document.createElement('button');
btnToggleEstado.className = `
    flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition
    border border-gray-300 dark:border-gray-500 shadow-sm
    ${tarea.completada 
        ? "bg-green-100 text-green-700 hover:bg-green-200" 
        : "bg-red-100 text-red-700 hover:bg-red-200"}
`;

btnToggleEstado.innerHTML = tarea.completada
    ? `<span class="text-base">✔️</span> Hecha`
    : `<span class="text-base">⭕</span> Pendiente`;

columnaEstado.appendChild(btnToggleEstado);

// Evento para cambiar estado
btnToggleEstado.addEventListener('click', () => {
    tarea.completada = !tarea.completada;
    guardarTareas();
    renderActual();
});


    const columnaPrioridad = document.createElement('div');
    columnaPrioridad.className = "flex justify-start md:justify-center md:w-24 mb-1 md:mb-0";
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

    const columnaAcciones = document.createElement('div');
    columnaAcciones.className = "flex justify-start md:justify-center md:w-24";
    contenedorMeta.appendChild(columnaAcciones);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = "cursor-pointer text-sm text-red-600 hover:text-red-800 transition-colors";
    columnaAcciones.appendChild(btnEliminar);

    btnEliminar.addEventListener('click', () => {
    li.style.transition = "all 0.3s ease";
    li.style.opacity = "0";
li.style.transform = "translateX(60px) scale(0.95)";
li.style.maxHeight = li.offsetHeight + "px";

setTimeout(() => {
    li.style.maxHeight = "0";
    li.style.marginTop = "0";
    li.style.paddingTop = "0";
    li.style.paddingBottom = "0";
}, 50);
    setTimeout(() => {
        const idx = tareas.indexOf(tarea);
        if (idx !== -1) tareas.splice(idx, 1);
        guardarTareas();
        renderActual();
    }, 300);
});

    return li;
}

// ------------------------------
// Mostrar tareas
// ------------------------------

/**
 * Obtiene la categoría actualmente seleccionada.
 * @returns {string} Categoría activa.
 */
function getCategoriaActiva() {
    const activa = document.querySelector('#lista-categorias li.bg-indigo-900[data-category]');
    return activa?.dataset?.category ?? 'Todas';
}

/**
 * Muestra las tareas filtradas por categoría y texto.
 * @param {string} filtro - Categoría seleccionada.
 * @param {string} textoBusqueda - Texto a buscar.
 */
function mostrarTareas(filtro = 'Todas', textoBusqueda = '') {
    listaTareas.innerHTML = '';
    const busqueda = textoBusqueda.toLowerCase();
    const fragment = document.createDocumentFragment();

    const listaOrdenada = ordenarTareas(tareas);

    for (const tarea of listaOrdenada) {
        const coincideCategoria = (filtro === 'Todas' || tarea.categoria === filtro);
        const coincideTexto = tarea.texto.toLowerCase().includes(busqueda);
        if (!coincideCategoria || !coincideTexto) continue;

        fragment.appendChild(crearTareaDOM(tarea));
    }

    if (fragment.childElementCount === 0) {
        const li = document.createElement('li');
        li.className = "flex flex-col items-center justify-center py-12 text-gray-500 dark:text-white";
        li.innerHTML = `
            <span class="text-5xl mb-3">🎉</span>
            <p class="text-lg font-semibold">¡Todo al día!</p>
            <p class="text-sm mt-1">No hay tareas aquí.</p>
        `;
        listaTareas.appendChild(li);
    } else {
        listaTareas.appendChild(fragment);
    }
}


// ------------------------------
// Cargar tareas
// ------------------------------

/**
 * Carga las tareas desde localStorage y las prepara para su uso.
 */
function cargarTareas() {
    const raw = localStorage.getItem('tareas');
    let parsed = [];

    try {
        parsed = raw ? JSON.parse(raw) : [];
    } catch {
        parsed = [];
    }

    tareas = Array.isArray(parsed)
        ? parsed.map(t => ({
            ...t,
            completada: typeof t.completada === 'boolean' ? t.completada : false,
            fecha: t.fecha || null,
        }))
        : [];

    renderActual();
}

// ------------------------------
// Añadir tarea
// ------------------------------

/**
 * Añade una nueva tarea a la lista y la guarda.
 * @param {Event} e - Evento del formulario.
 */
function agregarTarea(e) {
    e.preventDefault();

    const texto = inputTarea.value.trim();
    const prioridad = selectPrioridad.value;
    const categoria = selectCategoria.value;
    const fecha = inputFecha.value || null;

    if (texto === '') return;

    const ultimaCategoria = categoria;
    const ultimaPrioridad = prioridad;

    tareas.push({ texto, prioridad, categoria, fecha, completada: false });
    guardarTareas();
    renderActual();

    formTareas.reset();

    selectCategoria.value = ultimaCategoria;
    selectPrioridad.value = ultimaPrioridad;
}

// ------------------------------
// CATEGORÍAS DINÁMICAS
// ------------------------------

/**
 * Crea un elemento <li> para una categoría.
 * @param {string} nombre - Nombre de la categoría.
 * @returns {HTMLElement} Elemento <li>.
 */
function crearCategoriaDOM(nombre) {
    const li = document.createElement('li');
    li.dataset.category = nombre;

    // Fondo de no seleccionada igual que categorías base
    li.className = `
        relative
        px-2 py-1 rounded w-full text-center
        bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white
        transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer
    `;

    const span = document.createElement('span');
    span.textContent = nombre;
    li.appendChild(span);

    if (!categoriasBase.includes(nombre)) {
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = "✖";
        btnEliminar.className = `
            absolute right-2 top-1/2 -translate-y-1/2
            text-red-600 hover:text-red-800
        `;
        btnEliminar.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarCategoria(nombre, li);
        });
        li.appendChild(btnEliminar);
    }

    li.addEventListener('click', () => seleccionarCategoria(li));

    return li;
}

/**
 * Añade una categoría al selector del formulario.
 * @param {string} nombre - Nombre de la categoría.
 */
function agregarCategoriaAlSelect(nombre) {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    selectCategoria.appendChild(option);
}

/**
 * Elimina una categoría creada por el usuario.
 * @param {string} nombre - Nombre de la categoría.
 * @param {HTMLElement} li - Elemento HTML de la categoría.
 */
function eliminarCategoria(nombre, li) {
    li.remove();

    const option = selectCategoria.querySelector(`option[value="${nombre}"]`);
    if (option) option.remove();

    categoriasUsuario = categoriasUsuario.filter(c => c !== nombre);
    guardarCategorias();

    if (getCategoriaActiva() === nombre) {
        const todas = listaCategorias.querySelector('li[data-category="Todas"]');
        seleccionarCategoria(todas);
    }
}

/**
 * Marca una categoría como seleccionada y actualiza la lista de tareas.
 * @param {HTMLElement} li - Elemento HTML de la categoría.
 */
function seleccionarCategoria(li) {
    const items = listaCategorias.querySelectorAll('li');

    items.forEach(item => {
        const activo = item === li;
        item.classList.toggle('bg-indigo-900', activo);
        item.classList.toggle('dark:bg-indigo-400', activo);
        item.classList.toggle('text-white', activo);
        item.classList.toggle('bg-gray-200', !activo);        
        item.classList.toggle('dark:bg-gray-600', !activo);
        item.classList.toggle('text-gray-800', !activo);
    });

    mostrarTareas(li.dataset.category, getTextoBusquedaActual());
}

/**
 * Crea una nueva categoría personalizada.
 */
function agregarCategoria() {
    const nombre = inputNuevaCategoria.value.trim();
    if (nombre === '') return;

    if (categoriasBase.includes(nombre) || categoriasUsuario.includes(nombre)) return;

    categoriasUsuario.push(nombre);
    guardarCategorias();

    const li = crearCategoriaDOM(nombre);
    listaCategorias.appendChild(li);

    agregarCategoriaAlSelect(nombre);

    inputNuevaCategoria.value = '';
}

// ------------------------------
// INIT
// ------------------------------

/**
 * Inicializa la aplicación: eventos, carga de datos y renderizado inicial.
 */
function initApp() {

    // Fecha mínima = hoy
    const hoy = new Date().toISOString().split("T")[0];
    inputFecha.min = hoy;

    btnTema.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });

    formTareas.addEventListener('submit', agregarTarea);

    selectOrden.addEventListener('change', () => {
        criterioOrdenActual = selectOrden.value;
        renderActual();
    });

    listaCategorias.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-category]');
        if (li) seleccionarCategoria(li);
    });

    inputBusqueda.addEventListener('input', renderActual);

    btnAgregarCategoria.addEventListener('click', agregarCategoria);

    inputNuevaCategoria.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarCategoria();
        }
    });

    cargarCategorias();

    categoriasUsuario.forEach(nombre => {
        const li = crearCategoriaDOM(nombre);
        listaCategorias.appendChild(li);
        agregarCategoriaAlSelect(nombre);
    });

    const categoriaTodas = listaCategorias.querySelector('li[data-category="Todas"]');
    if (categoriaTodas) seleccionarCategoria(categoriaTodas);

    cargarTareas();
}

initApp();
