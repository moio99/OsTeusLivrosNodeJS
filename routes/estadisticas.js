const express = require('express');
const router = express.Router();
const estadisticas = require('../services/estadisticas');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));

    const usuario = req.headers['usuarinho'];
    const rol = req.headers['rolroleiro'];
    const auth = req.headers['authorization'];

    console.log('usuarinho:', usuario);
    console.log('rolroleiro:', rol);
    console.log('authorization:', auth);

    res.json(await estadisticas.getEstadisticas(req.query.tipo));
  } catch (err) {
    console.error(`Erro ao obter as estadísticas `, err.message);
    next(err);
  }
});

module.exports = router;