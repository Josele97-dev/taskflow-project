const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.get('/', taskController.obtenerTodas);
router.post('/', taskController.crearTarea);
router.delete('/:id', taskController.eliminarTarea);
router.put('/:id', taskController.actualizarTarea);

module.exports = router;
