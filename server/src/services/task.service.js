let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const nuevaTarea = {
    id: Date.now().toString(),
    title: data.title,
    completed: false
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

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};
