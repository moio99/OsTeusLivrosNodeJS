import express from 'express';
const router = express.Router();
import ColecomController from '../../controllers/colecons.js'

/**
 * @openapi
 * tags:
 *   - name: Coleçons
 *     description: Gestom de coleçons
 */

/**
 * @openapi
 * /Colecons:
 *   get:
 *     tags: [Coleçons]
 *     summary: Obtem o listado das coleçons.
 *     description: Obtem o listado básico das coleçons.
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorials nom encontradas
 */
router.get('/', ColecomController.getAll);

/**
 * @openapi
 * /Colecons/ColecomPorNome:
 *   get:
 *     tags: [Coleçons]
 *     summary: Obtem umha coleçom
 *     description: Filtra polo nome da coleçom.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da coleçom
 *         example: 'Coleçom mini'
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorial nom atopada
 */
 router.get('/ColecomPorNome', ColecomController.getByNome);

/**
 * @openapi
 * /Colecons/ColeconsCosLivros:
 *   get:
 *     tags: [Coleçons]
 *     summary: Listado de cloeçons cos livros.
 *     description: Um listado de cloeçons onde por cara umha vem o número de livros que tem.
 *     responses:
 *       200:
 *         description: Éxito total.
 */
router.get('/ColeconsCosLivros', ColecomController.getColeconsCosLivros);

/**
 * @openapi
 * /Colecons/Colecom:
 *   get:
 *     tags: [Coleçons]
 *     summary: Obtem umha coleçom concreta
 *     description: Obtem umha coleçom polo id.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da coleçom
 *         example: 19
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Coleçom nom atopada
 */
 router.get('/Colecom', ColecomController.getColecom);

/**
 * @openapi
 * /Colecons/Colecom:
 *   post:
 *     tags: [Coleçons]
 *     summary: Crea umha nova coleçom
 *     description: Registra umha nova coleçom no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da coleçom
 *                 example: "Coleçom mini"
 *               isbn:
 *                 type: string
 *                 description: ISBN da coleçom
 *                 example: "12-3456-789"
 *               web:
 *                 type: string
 *                 description: Web da coleçom
 *                 example: "www.editorialgalaxia.com/mini"
 *               comentario:
 *                 type: string
 *                 description: Comentario da coleçom
 *                 example: "A coleçom dos livros pequenos"
 *     responses:
 *       201:
 *         description: Coleçom creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idResult:
 *                   type: integer
 *                   example: 3
 *                   description: O identificador do resultado da operación.
 *                 meta:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                       description: O identificador interno do recurso afectado.
 *       400:
 *         description: Dados incorrectos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan campos obrigatorios"
 *       409:
 *         description: Já existe umha coleçom com ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe umha coleçom com ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/Colecom', ColecomController.postColecom);

/**
 * @openapi
 * /Colecons/Colecom:
 *   put:
 *     tags: [Coleçons]
 *     summary: Actualiza umha coleçom
 *     description: Modifica umha coleçom no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID da coleçom
 *                 example: 3
 *               nome:
 *                 type: string
 *                 description: Nome da coleçom
 *                 example: "Coleçom mini"
 *               isbn:
 *                 type: string
 *                 description: ISBN da coleçom
 *                 example: "12-3456-789"
 *               web:
 *                 type: string
 *                 description: Web da coleçom
 *                 example: "www.editorialgalaxia.com/mini"
 *               comentario:
 *                 type: string
 *                 description: Comentario da coleçom
 *                 example: "A coleçom dos livros pequenos"
 *     responses:
 *       201:
 *         description: Coleçom creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idResult:
 *                   type: integer
 *                   example: 3
 *                   description: O identificador do resultado da operación.
 *                 meta:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                       description: O identificador interno do recurso afectado.
 *       400:
 *         description: Dados incorrectos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan campos obrigatorios"
 *       409:
 *         description: Já existe umha coleçom con ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe umha coleçom con ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/Colecom', ColecomController.putColecom);

/**
 * @openapi
 * /Colecons/Colecom:
 *   delete:
 *     tags: [Coleçons]
 *     summary: Elimina umha coleçom
 *     description: Elimina umha coleçom no sistema
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da coleçom que se vai borrar
 *         example: 20
 *     responses:
 *       201:
 *         description: Coleçom eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idResult:
 *                   type: integer
 *                   example: 3
 *                   description: O identificador do resultado da operación.
 *                 meta:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                       description: O identificador interno do recurso afectado.
 *       400:
 *         description: Dados incorrectos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan campos obrigatorios"
 *       403:
 *         description: Nom autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nom tes permisos para eliminar esta coleçom"
 *       404:
 *         description: Coleçom nom atopada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Coleçom nom atopada para este usuario"
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/Colecom', ColecomController.deleteColecom);

export default router;
