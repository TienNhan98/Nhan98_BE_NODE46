import video from "./video.swagger.js";

const swaggerDocument = {
  openapi: "3.1.0",
  info: {
    title: "VŨ TRỤ TIÊN TRI",
    version: "1.0.0.0.0",
  },
  servers: [
    {
      url: "http://localhost:8386",
      description: "localhost serve",
    },
  ],
  components: {
    securitySchemes: {
      TestToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...video,
  },
};

export default swaggerDocument;
