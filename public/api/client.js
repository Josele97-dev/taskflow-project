const BACKEND_URL = '';
const BASE_URL = `${BACKEND_URL}/api/v1/tasks`;
const BASE_URL_CATEGORIES = `${BACKEND_URL}/api/v1/categories`;

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
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
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
const data = await response.json();

if (!response.ok) {
  throw new Error(data.message);
}

return data;

}

async function eliminarCategoria(nombre) {
  const response = await fetch(`${BASE_URL_CATEGORIES}/${nombre}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar la categoría');
}

export { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea, obtenerCategorias, crearCategoria, eliminarCategoria };