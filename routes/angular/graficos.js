import express from 'express';
const router = express.Router();
import GraficoController from '../../controllers/graficos.js';

/**
 * @openapi
 * tags:
 *   - name: Gráficos
 *     description: Gráficos e estatísticas da biblioteca
 */

/**
 * @openapi
 * /Graficos/PaginasPorIdiomaEAno:
 *   get:
 *     tags: [Gráficos]
 *     summary: Obtem as páxinas lidas por idioma e ano.
 *     description: Devolve o número de páxinas lidas por idioma e ano, contando livros e relecturas do usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PaginasPorIdiomaEAno', GraficoController.getPaginasPorIdiomaEAno);

export default router;
