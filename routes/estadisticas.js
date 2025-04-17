const express = require('express');
const router = express.Router();
const estadisticas = require('../services/estadisticas');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    const resultado = await estadisticas.getEstadisticas(req.idUsuario, req.query.tipo);
    if (resultado === '') {
      res.statusMessage = `O tipo ${req.query.tipo} nom é um dos válidos`
      res.status(404).end()
    }
    else 
      res.json(resultado);
  } catch (err) {
    console.error(`Erro ao obter as estadísticas `, err.message);
    next(err);
  }
});

router.get('/Pagina', async function(req, res, next) {
  try {
    const resultado = await estadisticas.getEstadisticas(req.query.idUsuario, req.query.tipo);
    if (resultado === '' && !resultado.data) {
      res.statusMessage = `O tipo ${req.query.tipo} nom é um dos válidos`
      res.status(404).end()
    }
    else {
      const html = resultado.data.map(element => {
        return `<div><strong>${element.nome}</strong> livros: ${element.quantidade} páginas: ${element.quantidadePaginas}</div>`;
      }).join('');    // Para que nom componha umha matriz
      
      res.send(`<div class="botom-fechar" onclick="borrarContido('${req.query.idDiv}')">❌Pechar</div>
        ${html}`
      );
    }
  } catch (err) {
    console.error(`Erro ao obter as estadísticas `, err.message);
    next(err);
  }
});

module.exports = router;