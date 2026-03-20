const BASE_URL = 'http://localhost:3000/api/v1/tasks';

async function obtenerTareas() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Error al obtener las tareas');
  return response.json();
}

async function crearTarea(tarea) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarea)
  });
  if (!response.ok) throw new Error('Error al crear la tarea');
  return response.json();
}

async function actualizarTarea(id, datos) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!response.ok) throw new Error('Error al actualizar la tarea');
  return response.json();
}

async function eliminarTarea(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar la tarea');
}

const BASE_URL_CATEGORIES = 'http://localhost:3000/api/v1/categories';

async function obtenerCategorias() {
  const response = await fetch(BASE_URL_CATEGORIES);
  if (!response.ok) throw new Error('Error al obtener las categorías');
  return response.json();
}

async function crearCategoria(nombre) {
  const response = await fetch(BASE_URL_CATEGORIES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  if (!response.ok) throw new Error('Error al crear la categoría');
  return response.json();
}

async function eliminarCategoria(nombre) {
  const response = await fetch(`${BASE_URL_CATEGORIES}/${nombre}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar la categoría');
}

export { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea, obtenerCategorias, crearCategoria, eliminarCategoria };