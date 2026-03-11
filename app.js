// DOM
const formTareas = document.getElementById('formulario-tareas');
const inputTarea = document.getElementById('input-tarea');
const selectPrioridad = document.getElementById('input-prioridad');
const selectCategoria = document.getElementById('input-categoria');
const inputFecha = document.getElementById('input-fecha');
const listaTareas = document.getElementById('lista-tareas');
const itemsCategorias = document.querySelectorAll('#lista-categorias li');
const inputBusqueda = document.getElementById('input-busqueda');
const selectOrden = document.getElementById('input-orden');
const btnTema = document.getElementById('colorbtn');

// Estado
let tareas = [];
let criterioOrdenActual = 'creacion';

// Persistencia
function guardarTareas(nextTareas = tareas) {
    localStorage.setItem('tareas', JSON.stringify(nextTareas));
}

function normalizarTexto(valor) {
    return String(valor ?? '').trim();
}

function getTextoBusquedaActual() {
    return normalizarTexto(inputBusqueda.value).toLowerCase();
}

function renderActual() {
    mostrarTareas(getCategoriaActiva(), getTextoBusquedaActual());
}

function ordenarTareas(lista) {
    if (criterioOrdenActual === 'creacion') return lista;

    const copia = [...lista];

    if (criterioOrdenActual === 'prioridad') {
        const pesoPrioridad = { alta: 0, media: 1, baja: 2 };
        copia.sort((a, b) => (pesoPrioridad[a.prioridad] ?? 99) - (pesoPrioridad[b.prioridad] ?? 99));
    } else if (criterioOrdenActual === 'texto') {
        copia.sort((a, b) =>
            normalizarTexto(a.texto).localeCompare(normalizarTexto(b.texto), 'es', { sensitivity: 'base' })
        );
    } else if (criterioOrdenActual === 'estado') {
        copia.sort((a, b) => (a.completada === b.completada ? 0 : a.completada ? 1 : -1));
    }

    return copia;
}

// Crear DOM de tarea
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

    // 🔧 CONTENEDOR META AJUSTADO (más a la izquierda)
    const contenedorMeta = document.createElement('div');
    contenedorMeta.className = `
        flex items-center flex-wrap
        gap-2 md:gap-4
        md:justify-start
        w-full md:w-auto
    `;
    li.appendChild(contenedorMeta);

    // Estado
    const columnaEstado = document.createElement('div');
    columnaEstado.className = "flex justify-start md:justify-center md:w-24 mb-1 md:mb-0";
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

    // Prioridad
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

    // Acciones
    const columnaAcciones = document.createElement('div');
    columnaAcciones.className = "flex justify-start md:justify-center md:w-24";
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

function getCategoriaActiva() {
    const activa = document.querySelector('#lista-categorias li.bg-indigo-900[data-category]');
    return activa?.dataset?.category ?? 'Todas';
}

function mostrarTareas(filtro = 'Todas', textoBusqueda = '') {
    listaTareas.innerHTML = '';
    const busqueda = String(textoBusqueda ?? '').toLowerCase();
    const fragment = document.createDocumentFragment();

    const listaOrdenada = ordenarTareas(tareas);

    for (const tarea of listaOrdenada) {
        const coincideCategoria = (filtro === 'Todas' || tarea.categoria === filtro);
        const coincideTexto = String(tarea.texto ?? '').toLowerCase().includes(busqueda);
        if (!coincideCategoria || !coincideTexto) continue;

        fragment.appendChild(crearTareaDOM(tarea));
    }

    listaTareas.appendChild(fragment);
}

function cargarTareas() {
    const raw = localStorage.getItem('tareas');
    let parsed = [];

    try {
        parsed = raw ? JSON.parse(raw) : [];
    } catch {
        parsed = [];
    }

    if (!Array.isArray(parsed)) {
        tareas = [];
        renderActual();
        return;
    }

    tareas = parsed.map((t) => ({
        ...t,
        completada: typeof t?.completada === 'boolean' ? t.completada : false,
        fecha: t?.fecha || null,
    }));

    renderActual();
}

function agregarTarea(e) {
    e.preventDefault();
    const texto = String(inputTarea.value ?? '').trim();
    const prioridad = selectPrioridad.value;
    const categoria = selectCategoria.value;
    const fecha = inputFecha.value || null;

    if (texto === '') return;

    tareas.push({ texto, prioridad, categoria, fecha, completada: false });
    guardarTareas();
    renderActual();
    formTareas.reset();
}

function initApp() {
    btnTema?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });

    formTareas.addEventListener('submit', agregarTarea);

    selectOrden?.addEventListener('change', () => {
        const valor = selectOrden.value;
        if (['creacion', 'prioridad', 'texto', 'estado'].includes(valor)) {
            criterioOrdenActual = valor;
            renderActual();
        }
    });

    document.getElementById('lista-categorias').addEventListener('click', (e) => {
        const cat = e.target.closest('li[data-category]');
        if (!cat) return;
        if (cat.classList.contains('bg-indigo-900')) return;

        itemsCategorias.forEach(item => {
            const activo = item === cat;
            item.classList.toggle('bg-indigo-900', activo);
            item.classList.toggle('dark:bg-indigo-400', activo);
            item.classList.toggle('text-white', activo);
            item.classList.toggle('bg-white', !activo);
            item.classList.toggle('dark:bg-gray-600', !activo);
            item.classList.toggle('text-gray-800', !activo);
        });

        mostrarTareas(cat.dataset.category, getTextoBusquedaActual());
    });

    inputBusqueda.addEventListener('input', () => {
        renderActual();
    });

    const categoriaTodas = document.querySelector('#lista-categorias li[data-category="Todas"]');
    if (categoriaTodas) {
        categoriaTodas.classList.add('bg-indigo-900', 'dark:bg-indigo-400', 'text-white');
        categoriaTodas.classList.remove('bg-white', 'dark:bg-gray-600', 'text-gray-800');
    }

    cargarTareas();
}

initApp();
