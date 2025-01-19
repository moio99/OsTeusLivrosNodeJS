const express = require("express");
const app = express();
const port = 5002;
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

app.use(express.json());
/* app.use(
  express.urlencoded({
    extended: true,
  })
); */

const allowedOrigins = ['http://localhost:4210', 'http://localhost:4230'];


app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res) => {

  /* var afterLoad=require('after-load');
  afterLoad('https://www.google.es/',function(html){
     console.log(html);
  }) */

  res.json({ message: "ok" });
});

app.use("/api/Estadisticas", estadisticasRouter);
app.use("/api/Graficos", graficosRouter);
app.use("/api/Livros", livrosRouter);
app.use("/api/Autores", autoresRouter);
app.use("/api/Editoriais", editoriaisRouter);
app.use("/api/Generos", generosRouter);
app.use("/api/Bibliotecas", bibliotecasRouter);
app.use("/api/Colecons", coleconsRouter);
app.use("/api/Outros", outrosRouter);
app.use("/api/Relecturas", relecturasRouter);
app.use("/api/EstilosLiterarios", estilosLiterariosRouter);

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