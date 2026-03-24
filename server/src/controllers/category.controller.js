const categoryService = require('../services/category.service');

function obtenerTodas(req, res) {
  const categorias = categoryService.obtenerTodas();
  res.json(categorias);
}

function crearCategoria(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: 'El body es obligatorio y debe ser JSON' });
  }

  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ message: 'El nombre es obligatorio y debe ser un string' });
  }

  try {
    const categoria = categoryService.crearCategoria(nombre.trim());
    return res.status(201).json(categoria);
  } catch (error) {
    if (error.message === 'ALREADY_EXISTS') {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }
    return next(error);
  }
}

function eliminarCategoria(req, res, next) {
  const { nombre } = req.params;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  try {
    categoryService.eliminarCategoria(nombre);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'BASE_CATEGORY') {
      return res.status(400).json({ message: 'No se pueden eliminar las categorías base' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    return next(error);
  }
}

module.exports = {
  obtenerTodas,
  crearCategoria,
  eliminarCategoria
};