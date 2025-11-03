const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cnpm API",
      version: "1.0.0",
      description: "API documentation"
    }
  },
  apis: ["./routes/*.js"] // Đường dẫn tới file chứa comment Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
