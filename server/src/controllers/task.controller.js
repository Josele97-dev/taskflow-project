const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

function crearTarea(req, res) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: 'El body es obligatorio y debe ser JSON' });
  }

  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'El título es obligatorio y debe ser un string' });
  }

  const nuevaTarea = taskService.crearTarea({ title });
  res.status(201).json(nuevaTarea);
}


function eliminarTarea(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'El id es obligatorio' });
  }

  try {
    taskService.eliminarTarea(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

function actualizarTarea(req, res, next) {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'El id es obligatorio' });
  }

  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ message: 'El título debe ser un string' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'El campo completed debe ser booleano' });
  }

  try {
    const tareaActualizada = taskService.actualizarTarea(id, { title, completed });
    return res.status(200).json(tareaActualizada);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea
};
