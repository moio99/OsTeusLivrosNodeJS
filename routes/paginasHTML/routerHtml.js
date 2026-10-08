import express from 'express';
const router = express.Router();
import taboaLivrosHtmlRouter from "./taboaLivrosHtml.js";
import estadisticasHtmlRouter from "./estadisticasHtml.js";

router.get('/', async function(req, res, next) {
  const resultado = {resultado:'Chamada realizada'};
  res.json(resultado);
});

const htmlBasico = `
  <!DOCTYPE html>
  <head><title>Listado de Livros</title></head>
  <body>Listado de Livros</body>
`;

router.get('/Proba', async function(req, res, next) {
  res.send(htmlBasico);
});


router.use("/taboa", taboaLivrosHtmlRouter);
router.use("/estadisticas", estadisticasHtmlRouter);


export default router;
