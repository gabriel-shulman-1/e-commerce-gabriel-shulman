const swaggerJsdoc = require('swagger-jsdoc');
const PORT = process.env.PORT || 8080;
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Documentación de la API'
    },
    servers: [
      {
        url: 'http://localhost:8080'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);