let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const nuevaTarea = {
    id: Date.now().toString(),
    texto: data.texto,
    prioridad: data.prioridad || 'media',
    categoria: data.categoria || 'Personal',
    fecha: data.fecha || null,
    completada: false
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
}

function eliminarTarea(id) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    throw new Error('NOT_FOUND');
  }

  tasks.splice(index, 1);
}

function actualizarTarea(id, data) {
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error('NOT_FOUND');
  }

  const tareaActual = tasks[index];

  const tareaActualizada = {
    ...tareaActual,
    ...(data.texto !== undefined && { texto: data.texto }),
    ...(data.prioridad !== undefined && { prioridad: data.prioridad }),
    ...(data.categoria !== undefined && { categoria: data.categoria }),
    ...(data.fecha !== undefined && { fecha: data.fecha }),
    ...(data.completada !== undefined && { completada: data.completada }),
  };

  tasks[index] = tareaActualizada;

  return tareaActualizada;
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea
};