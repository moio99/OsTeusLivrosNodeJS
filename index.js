const express = require("express");
const app = express();
require('dotenv').config(); // para usar o .env
const port = process.env.PORT || 5002;
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
const probaRouter = require("./routes/proba");

app.use(express.json());
/* app.use(
  express.urlencoded({
    extended: true,
  })
); */

const allowedOrigins = ['http://localhost:4210', 'http://localhost:4230'];
const middleware = require('./utils/middleware')


app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization, rolroleiro, usuarinho');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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
app.use("/api/Proba", probaRouter);

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