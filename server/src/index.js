const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');
const categoryRoutes = require('./routes/category.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;

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
