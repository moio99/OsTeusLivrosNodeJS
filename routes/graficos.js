import express from 'express';
const router = express.Router();
import graficos from '../services/graficos.js';

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

export default router;