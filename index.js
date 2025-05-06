const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config(); // para usar o .env
const port = process.env.PORT || 3000;
const middleware = require('./utils/middleware');
const loginRouter = require("./utils/login");
const estadisticasRouter = require("./routes/estadisticas");
const graficosRouter = require("./routes/graficos");
const livrosRouter = require("./routes/livros");
const autoresRouter = require("./routes/autores");
const editoriaisRouter = require("./routes/editoriais");
const generosRouter = require("./routes/generos");
const bibliotecasRouter = require("./routes/bibliotecas");
const coleconsRouter = require("./routes/colecons");
const outrosRouter = require("./routes/outros");
const relecturasRouter = require("./routes/relecturas");
const estilosLiterariosRouter = require("./routes/estilosLiterarios");
const paginasRouter = require("./routes/paginas");
const construconsBD = require("./routes/construconsBD");

app.use(express.json());
/* app.use(
  express.urlencoded({
    extended: true,
  })
); */
const path = require('path');
app.use(express.static('public'));    // para poder carregar no html o estadisticas.js
// __dirname  variavel global especial em Node.js que contem a rota absoluta do directorio onde se atopa o arquivo atual
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = [
  'https://osteuslivrosangular-production.up.railway.app', // Frontend de railway
  'https://osteuslivrosangular.onrender.com', // Frontend de render.com
  'http://localhost:4210',
  'http://localhost:4230'
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Podes chamar à API no porto: ${port}`);
});