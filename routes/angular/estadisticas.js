import express from 'express';
const router = express.Router();
import estadisticasController from '../../controllers/estadisticas.js';
/**
 * @openapi
 * tags:
 *   - name: Estadisticas
 *     description: Gestom de editoriais
 */

/**
 * @openapi
 * /Estadisticas:
 *   get:
 *     tags: [Estadisticas]
 *     summary: Obtem o listado das estadísticas.
 *     description: Obtem o listado das estadísticas para um tipo passado.
 *     parameters:
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: integer
 *         description: tipo de estadíscas que se quere 1 por idioma, 2 por géneros, 3 por anos e 4 por autor. 
 *         example: 1
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Estadisticas nom atopadas
 */
router.get('/', estadisticasController.getAll);

export default router;
