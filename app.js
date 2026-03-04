const formulario = document.getElementById('formulario-tareas');
const input = document.getElementById('input-tarea');
const selectPrioridad = document.getElementById('input-prioridad');
const selectCategoria = document.getElementById('input-categoria');
const lista = document.getElementById('lista-tareas');
const categorias = document.querySelectorAll('#lista-categorias li');
const inputBusqueda = document.getElementById('input-busqueda');

let tareas = [];

function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function crearTareaDOM(tarea) {
    const li = document.createElement('li');
    li.classList.add('task');
    li.dataset.category = tarea.categoria;

    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarea.texto;
    li.appendChild(spanTexto);

    const spanPrioridad = document.createElement('span');
    spanPrioridad.classList.add('priority', tarea.prioridad);
    spanPrioridad.textContent = tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1);
    li.appendChild(spanPrioridad);

    const spanCategoria = document.createElement('span');
    spanCategoria.classList.add('category');
    spanCategoria.textContent = tarea.categoria;
    li.appendChild(spanCategoria);

    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'Eliminar';
    li.appendChild(btnBorrar);

    btnBorrar.addEventListener('click', () => {
        tareas.splice(tareas.indexOf(tarea), 1);
        guardarTareas();
        mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
    });

    return li;
}

function getCategoriaActiva() { 
    const activa = document.querySelector('#lista-categorias li.active');
    return activa ? activa.dataset.category : 'Todas';
}

function mostrarTareas(filtro = 'Todas', textoBusqueda = '') {
    lista.innerHTML = '';
    tareas.forEach((tarea) => {
        if ((filtro === 'Todas' || tarea.categoria === filtro) &&
            tarea.texto.toLowerCase().includes(textoBusqueda.toLowerCase())) {
            lista.appendChild(crearTareaDOM(tarea));
        }
    });
}

function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareasGuardadas;
    mostrarTareas();
}

function agregarTarea(e) {
    e.preventDefault();
    const texto = input.value.trim();
    const prioridad = selectPrioridad.value;
    const categoria = selectCategoria.value;

    if (texto === '') return;

    const tarea = { texto, prioridad, categoria };
    tareas.push(tarea);
    guardarTareas();
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
    formulario.reset();
}

formulario.addEventListener('submit', agregarTarea);

categorias.forEach(cat => {
    cat.addEventListener('click', () => {
        categorias.forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        mostrarTareas(cat.dataset.category, inputBusqueda.value.trim());
    });
});

inputBusqueda.addEventListener('input', () => {
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
});

cargarTareas();

































