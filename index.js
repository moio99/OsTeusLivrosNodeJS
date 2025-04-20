const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config(); // para usar o .env
const port = 5002;
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
  'https://osteuslivrosnodejs-production.up.railway.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem nom permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'rolroleiro', 'usuarinho'],
  credentials: true
}));

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

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Podes chamar à API no porto: ${port}`);
});