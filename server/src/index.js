const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');
const categoryRoutes = require('./routes/category.routes');

const swaggerUi = require('swagger-ui-express');

// Cargar el swagger.json estático
const swaggerDocument = require('../swagger.json');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de Swagger (debe estar dentro de /api/v1 para que Vercel la envíe al backend)
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Exponer el JSON para verificar que existe en producción
app.get('/api/v1/swagger.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../swagger.json'));
});

// Rutas reales de la API
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Middleware de errores
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ message: 'Recurso no encontrado' });
  }

  if (err.message === 'BAD_REQUEST') {
    return res.status(400).json({ message: 'Solicitud inválida' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor local
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
