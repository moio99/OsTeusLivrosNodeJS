import express from 'express';
const router = express.Router();
import estadisticas from '../services/estadisticas.js';

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

export default router;
