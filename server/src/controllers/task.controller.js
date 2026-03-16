const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

function crearTarea(req, res) {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'El título es obligatorio y debe ser un string' });
  }

  const nuevaTarea = taskService.crearTarea({ title });

  res.status(201).json(nuevaTarea);
}

function eliminarTarea(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'El id es obligatorio' });
  }

  try {
    taskService.eliminarTarea(id);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};
