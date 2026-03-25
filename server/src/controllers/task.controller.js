const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

function crearTarea(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: 'El body es obligatorio y debe ser JSON' });
  }

  const { texto, prioridad, categoria, fecha } = req.body;

  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({ message: 'El campo texto es obligatorio y debe ser un string' });
  }

  const prioridadesValidas = ['alta', 'media', 'baja'];
  if (prioridad !== undefined && !prioridadesValidas.includes(prioridad)) {
    return res.status(400).json({ message: 'La prioridad debe ser alta, media o baja' });
  }

  if (categoria !== undefined && typeof categoria !== 'string') {
    return res.status(400).json({ message: 'La categoría debe ser un string' });
  }

  if (fecha !== undefined && fecha !== null && isNaN(Date.parse(fecha))) {
    return res.status(400).json({ message: 'La fecha no tiene un formato válido' });
  }

  try {
    const nuevaTarea = taskService.crearTarea({ texto, prioridad, categoria, fecha });
    return res.status(201).json(nuevaTarea);
  } catch (error) {
    if (error.message === 'ALREADY_EXISTS') {
      return res.status(400).json({ message: 'Ya existe una tarea con el mismo título, categoría y prioridad' });
    }
    return next(error);
  }
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
  const { texto, prioridad, categoria, fecha, completada } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'El id es obligatorio' });
  }

  if (texto !== undefined && typeof texto !== 'string') {
    return res.status(400).json({ message: 'El campo texto debe ser un string' });
  }

  const prioridadesValidas = ['alta', 'media', 'baja'];
  if (prioridad !== undefined && !prioridadesValidas.includes(prioridad)) {
    return res.status(400).json({ message: 'La prioridad debe ser alta, media o baja' });
  }

  if (categoria !== undefined && typeof categoria !== 'string') {
    return res.status(400).json({ message: 'La categoría debe ser un string' });
  }

  if (fecha !== undefined && fecha !== null && isNaN(Date.parse(fecha))) {
    return res.status(400).json({ message: 'La fecha no tiene un formato válido' });
  }

  if (completada !== undefined && typeof completada !== 'boolean') {
    return res.status(400).json({ message: 'El campo completada debe ser booleano' });
  }

  try {
    const tareaActualizada = taskService.actualizarTarea(id, { texto, prioridad, categoria, fecha, completada });
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