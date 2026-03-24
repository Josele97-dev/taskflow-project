const express = require('express');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', categoryController.obtenerTodas);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', categoryController.crearCategoria);

/**
 * @swagger
 * /categories/{nombre}:
 *   delete:
 *     summary: Eliminar una categoría
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/:nombre', categoryController.eliminarCategoria);

module.exports = router;