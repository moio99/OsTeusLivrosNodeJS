const express = require('express');
const router = express.Router();
const graficos = require('../services/graficos');

/**
 * GET
 */
router.get('/PaginasPorIdiomaEAno', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await graficos.getPaginasPorIdiomaEAno(req.idUsuario, req.query.tipo));
  } catch (err) {
    console.error(`Erro ao obter os dados dos gráficos PaginasPorIdiomaEAno `, err.message);
    next(err);
  }
});

module.exports = router;