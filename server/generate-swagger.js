const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API REST para gestionar tareas y categorías',
    },
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

const outputPath = path.join(__dirname, 'swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log('✔ swagger.json generado en /server/swagger.json');
