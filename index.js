/* de commonJS (com require) o passo a ESModules (com imports)
*/
import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import middleware from './utils/middleware.js';
import loginRouter from "./utils/login.js";
import estadisticasRouter from "./routes/angular/estadisticas.js";
import graficosRouter from "./routes/angular/graficos.js";
import livrosRouter from "./routes/angular/livros.js";
import autoresRouter from "./routes/angular/autores.js";
import editoriaisRouter from "./routes/angular/editoriais.js";
import generosRouter from "./routes/angular/generos.js";
import bibliotecasRouter from "./routes/angular/bibliotecas.js";
import coleconsRouter from "./routes/angular/colecons.js";
import outrosRouter from "./routes/angular/outros.js";
import relecturasRouter from "./routes/angular/relecturas.js";
import estilosLiterariosRouter from "./routes/angular/estilosLiterarios.js";
import paginasRouter from "./routes/paginasHTML/routerHtml.js";
import construconsBD from "./routes/construconsBD.js";
import corsMiddleware from "./middlewares/cors.js"
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

app.use(corsMiddleware());
// antes do de enriba ussa isto:  app.use(cors({
//   origin: function (origin, callback) {


// Configuraçom de OpenAPI / Swagger      http://localhost:5002/api-docs
const opcionsSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'A minha API em Node 20 com OpenAPI',
      version: '1.0.0',
      description: 'Documentaçom automatizada da minha API',
    },
    servers: [{ url: `http://localhost:${port}/api`}],
  },
  apis: ['./routes/angular/*.js'], // Rotas onde o paquete buscará os teus comentarios de documentación
};
const swaggerDocs = swaggerJsdoc(opcionsSwagger);
const uiOptions = {
  swaggerOptions: {
    docExpansion: 'none', // 'list' | 'full' | 'none'  com none todas as listas aparecem colapsadas
    tagsSorter: 'alpha', // Ordena as secçons (tags) alfabeticamente
    // operationsSorter: 'alpha' // ordena também os endpoints dentro de cada secçom alfabeticamente
  }
};

// Ruta para servir a especificación en JSON puro
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, uiOptions));

app.use(middleware.requestLogger);
app.use('/api/login', loginRouter);
app.use("/api/Estadisticas", middleware.controlUsuario, estadisticasRouter);
app.use("/api/Graficos", middleware.controlUsuario, graficosRouter);
app.use("/api/Livros", middleware.controlUsuario, livrosRouter);
app.use("/api/Autores", middleware.controlUsuario, autoresRouter);
app.use("/api/Editoriais", middleware.controlUsuario, editoriaisRouter);
app.use("/api/Generos", middleware.controlUsuario, generosRouter);
app.use("/api/Bibliotecas", middleware.controlUsuario, bibliotecasRouter);
app.use("/api/Colecons", middleware.controlUsuario, coleconsRouter);
app.use("/api/Outros", middleware.controlUsuario, outrosRouter);
app.use("/api/Relecturas", middleware.controlUsuario, relecturasRouter);
app.use("/api/EstilosLiterarios", middleware.controlUsuario, estilosLiterariosRouter);
app.use("/api/paginas", paginasRouter);
app.use("/api/ConstruconsBD", construconsBD);
app.use(middleware.unknownEndpoint);    // debe ir despois das rotas válidas

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