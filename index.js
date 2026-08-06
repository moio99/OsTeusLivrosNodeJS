import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import middleware from './utils/middleware.js';
import loginRouter from "./utils/login.js";
import estadisticasRouter from "./routes/estadisticas.js";
import graficosRouter from "./routes/graficos.js";
import livrosRouter from "./routes/livros.js";
import autoresRouter from "./routes/autores.js";
import editoriaisRouter from "./routes/editoriais.js";
import generosRouter from "./routes/generos.js";
import bibliotecasRouter from "./routes/bibliotecas.js";
import coleconsRouter from "./routes/colecons.js";
import outrosRouter from "./routes/outros.js";
import relecturasRouter from "./routes/relecturas.js";
import estilosLiterariosRouter from "./routes/estilosLiterarios.js";
import paginasRouter from "./routes/paginas.js";
import construconsBD from "./routes/construconsBD.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config(); // para usar o .env
const port = 5002;

app.use(express.json());
/* app.use(
  express.urlencoded({
    extended: true,
  })
); */
app.use(express.static('public'));    // para poder carregar no html o estadisticas.js
// __dirname  variavel global especial em Node.js que contem a rota absoluta do directorio onde se atopa o arquivo atual
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = [
  'https://osteuslivrosangular-production.up.railway.app', // Frontend de railway
  'https://osteuslivrosangular.onrender.com', // Frontend de render.com
  'http://localhost:4210',
  'http://localhost:4230',
  'http://localhost:5002'   // Para as chamdas dende o swagger (OpenApi)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin 'origin' (como Postman o móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
      return callback(null, true);
    } else {
      console.warn('⚠ Origem bloqueado polas CORS:', origin);
      return callback(new Error('Origem nom permitido'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'rolroleiro', 'usuarinho'],
  exposedHeaders: ['rolroleiro', 'usuarinho'], // Headers personalizados
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Manejo explícito de OPTIONS para todas las rutas
//app.options('*', cors());



// Configuraçom de OpenAPI / Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'A minha API em Node 20',
      version: '1.0.0',
      description: 'Documentaçom automatizada da minha API',
    },
    servers: [{ url: `http://localhost:${port}/api` }],
  },
  apis: ['./routes/*.js'], // Rotas onde o paquete buscará os teus comentarios de documentación
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Ruta para servir a especificación en JSON puro
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use("/api/Estadisticas", middleware.userExtractor, estadisticasRouter);
app.use("/api/Graficos", middleware.userExtractor, graficosRouter);
app.use("/api/Livros", middleware.userExtractor, livrosRouter);
app.use("/api/Autores", middleware.userExtractor, autoresRouter);
app.use("/api/Editoriais", middleware.userExtractor, editoriaisRouter);
app.use("/api/Generos", middleware.userExtractor, generosRouter);
app.use("/api/Bibliotecas", middleware.userExtractor, bibliotecasRouter);
app.use("/api/Colecons", middleware.userExtractor, coleconsRouter);
app.use("/api/Outros", middleware.userExtractor, outrosRouter);
app.use("/api/Relecturas", middleware.userExtractor, relecturasRouter);
app.use("/api/EstilosLiterarios", middleware.userExtractor, estilosLiterariosRouter);
app.use("/api/Paginas", paginasRouter);
app.use("/api/ConstruconsBD", construconsBD);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Podes chamar à API na direiçom http://localhost:${port}`);
});