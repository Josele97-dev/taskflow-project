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
    li.className="flex justify-between items-center bg-gray-200 p-3 rounded-md mt-3 transition-transform text-black transition-shadow duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md"
    li.dataset.category = tarea.categoria;
    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarea.texto;
    spanTexto.className = "flex-1 mr-2 break-words";
    li.appendChild(spanTexto);

    const spanPrioridad = document.createElement('span');
    spanPrioridad.className = `
        flex-none ml-2 px-2 py-1 rounded-full text-white text-sm
        ${tarea.prioridad === "alta" ? "bg-red-500" :
          tarea.prioridad === "media" ? "bg-yellow-500" :
          "bg-green-500"}
    `;
    spanPrioridad.textContent = tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1);
    li.appendChild(spanPrioridad);

    const spanCategoria = document.createElement('span');
    spanCategoria.textContent = tarea.categoria;
    spanCategoria.className = "ml-2 text-sm text-gray-600";
    li.appendChild(spanCategoria);

    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'Eliminar';
    btnBorrar.className = "flex-none ml-2 cursor-pointer text-red-600 hover:text-red-800 transition-colors";
    li.appendChild(btnBorrar);

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
        categorias.forEach(c => {
            c.classList.remove('bg-indigo-900', 'text-white');
            c.classList.add('bg-white', 'text-gray-800');
        });
        cat.classList.remove('bg-white', 'text-gray-800');
        cat.classList.add('bg-indigo-900', 'text-white');
        mostrarTareas(cat.dataset.category, inputBusqueda.value.trim());
    });
});

inputBusqueda.addEventListener('input', () => {
    mostrarTareas(getCategoriaActiva(), inputBusqueda.value.trim());
});

cargarTareas();