import express from 'express';
const router = express.Router();
import editoriais from '../../services/editoriais.js';

import EditorialController from '../../controllers/editoriais.js'

/**
 * @openapi
 * tags:
 *   - name: Editoriais
 *     description: Gestom de editoriais
 */

/**
 * @openapi
 * /Editoriais:
 *   get:
 *     tags: [Editoriais]
 *     summary: Obtem o listado das
 *     description: Obtem o listado das editoriais.
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorials nom encontradas
 */
router.get('/', EditorialController.getAll);

/**
 * @openapi
 * /Editoriais/EditorialPorNome:
 *   get:
 *     tags: [Editoriais]
 *     summary: Obtem umha editorial
 *     description: Filtra polo nome da editorial.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da editorial
 *         example: 'Aira Editorial'
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorial nom atopada
 */
router.get('/EditorialPorNome', EditorialController.getByNome);

/**
 * @openapi
 * /Editoriais/EditoriaisCosLivros:
 *   get:
 *     tags: [Editoriais]
 *     summary: Listado de editorriais cos livros.
 *     description: Um listado de editoriais onde por cara umha vem o número de livros que tem.
 *     responses:
 *       200:
 *         description: Éxito total.
 */
router.get('/EditoriaisCosLivros', EditorialController.getEditoriaisCosLivros);

/**
 * @openapi
 * /Editoriais/Editorial:
 *   get:
 *     tags: [Editoriais]
 *     summary: Obtem umha editorial concreta
 *     description: Obtem umha editorial polo id.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da editorial
 *         example: 89
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorial nom atopada
 */
router.get('/Editorial', EditorialController.getEditorial);

/**
 * @openapi
 * /Editoriais/Editorial:
 *   post:
 *     tags: [Editoriais]
 *     summary: Crea umha nova editorial
 *     description: Registra umha nova editorial no sistema
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
 *                 description: Nome da editorial
 *                 example: "Xerais"
 *               direicom:
 *                 type: string
 *                 description: Direicom da editorial
 *                 example: "Rúa Dr. Marañón, 10 - 12"
 *               web:
 *                 type: string
 *                 description: Web da editorial
 *                 example: "www.xerais.gal"
 *               comentario:
 *                 type: string
 *                 description: Comentario da editorial
 *                 example: "A editorial dos livros"
 *     responses:
 *       201:
 *         description: Editorial creada correctamente
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
 *         description: Já existe umha editorial com ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe umha editorial com ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/Editorial', EditorialController.postEditorial);

/**
 * @openapi
 * /Editoriais/Editorial:
 *   put:
 *     tags: [Editoriais]
 *     summary: Actualiza umha editorial
 *     description: Modifica umha editorial no sistema
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
 *                 description: ID da editorial
 *                 example: 3
 *               nome:
 *                 type: string
 *                 description: Nome da editorial
 *                 example: "Xerais"
 *               direicom:
 *                 type: string
 *                 description: Direicom da editorial
 *                 example: "Rúa Dr. Marañón, 10 - 12"
 *               web:
 *                 type: string
 *                 description: Web da editorial
 *                 example: "www.xerais.gal"
 *               comentario:
 *                 type: string
 *                 description: Comentario da editorial
 *                 example: "A editorial dos livros"
 *     responses:
 *       201:
 *         description: Editorial creada correctamente
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
 *         description: Já existe umha editorial com ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe umha editorial com ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/Editorial', EditorialController.putEditorial);

/**
 * @openapi
 * /Editoriais/Editorial:
 *   delete:
 *     tags: [Editoriais]
 *     summary: Elimina umha editorial
 *     description: Elimina umha editorial no sistema
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da editorial que se vai borrar
 *         example: 116
 *     responses:
 *       201:
 *         description: Editorial eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idResult:
 *                   type: integer
 *                   example: 116
 *                   description: O identificador do resultado da operación.
 *                 meta:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 116
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
router.delete('/Editorial', EditorialController.deleteEditorial);

export default router;
