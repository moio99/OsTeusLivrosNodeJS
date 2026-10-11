import express from 'express';
const router = express.Router();
import BibliotecaController from '../../controllers/bibliotecas.js'

/**
 * @openapi
 * tags:
 *   - name: Bibliotecas
 *     description: Gestom de bibliotecas
 */

/**
 * @openapi
 * /Bibliotecas:
 *   get:
 *     tags: [Bibliotecas]
 *     summary: Obtem o listado das bibliotecas.
 *     description: Obtem o listado básico das bibliotecas.
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorials nom encontradas
 */
router.get('/', BibliotecaController.getAll);

/**
 * @openapi
 * /Bibliotecas/BibliotecaPorNome:
 *   get:
 *     tags: [Bibliotecas]
 *     summary: Obtem umha biblioteca
 *     description: Filtra polo nome da biblioteca.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da biblioteca
 *         example: 'Duram Loriga'
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorial nom atopada
 */
 router.get('/BibliotecaPorNome', BibliotecaController.getByNome);

/**
 * @openapi
 * /Bibliotecas/BibliotecasCosLivros:
 *   get:
 *     tags: [Bibliotecas]
 *     summary: Listado de cloeçons cos livros.
 *     description: Um listado de cloeçons onde por cara umha vem o número de livros que tem.
 *     responses:
 *       200:
 *         description: Éxito total.
 */
router.get('/BibliotecasCosLivros', BibliotecaController.getBibliotecasCosLivros);

/**
 * @openapi
 * /Bibliotecas/Biblioteca:
 *   get:
 *     tags: [Bibliotecas]
 *     summary: Obtem umha biblioteca concreta
 *     description: Obtem umha biblioteca polo id.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da biblioteca
 *         example: 31
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Biblioteca nom atopada
 */
 router.get('/Biblioteca', BibliotecaController.getBiblioteca);

/**
 * @openapi
 * /Bibliotecas/Biblioteca:
 *   post:
 *     tags: [Bibliotecas]
 *     summary: Crea umha nova biblioteca
 *     description: Registra umha nova biblioteca no sistema
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
 *                 description: Nome da biblioteca
 *                 example: "Própria"
 *               dataRenovacom:
 *                 type: date-time
 *                 description: Data da renovaçom na biblioteca
 *                 example: "2026-05-02"
 *               endereco:
 *                 type: string
 *                 description: endereço da biblioteca
 *                 example: "Rúa nova 31"
 *               localidade:
 *                 type: string
 *                 description: localidade da biblioteca
 *                 example: "Corunha"
 *               telefone:
 *                 type: string
 *                 description: telefone da biblioteca
 *                 example: "981 981 981"
 *               dataAsociamento:
 *                 type: date-time
 *                 description: Data da asociamento na biblioteca
 *                 example: "2001-05-02"
 *               comentario:
 *                 type: string
 *                 description: Comentario da biblioteca
 *                 example: "A biblioteca no centro"
 *     responses:
 *       201:
 *         description: Biblioteca creada correctamente
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
 *         description: Já existe umha biblioteca com ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe umha biblioteca com ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/Biblioteca', BibliotecaController.postBiblioteca);

/**
 * @openapi
 * /Bibliotecas/Biblioteca:
 *   put:
 *     tags: [Bibliotecas]
 *     summary: Actualiza umha biblioteca
 *     description: Modifica umha biblioteca no sistema
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
 *                 description: ID da biblioteca
 *                 example: 3
 *               nome:
 *                 type: string
 *                 description: Nome da biblioteca
 *                 example: "Própria"
 *               dataRenovacom:
 *                 type: date-time
 *                 description: Data da renovaçom na biblioteca
 *                 example: "2026-05-02"
 *               endereco:
 *                 type: string
 *                 description: endereço da biblioteca
 *                 example: "Rúa nova 31"
 *               localidade:
 *                 type: string
 *                 description: localidade da biblioteca
 *                 example: "Corunha"
 *               telefone:
 *                 type: string
 *                 description: Telefone da biblioteca
 *                 example: "981 981 981"
 *               dataAsociamento:
 *                 type: date-time
 *                 description: Data de asociamento na biblioteca
 *                 example: "2001-05-02"
 *               comentario:
 *                 type: string
 *                 description: Comentario da biblioteca
 *                 example: "A biblioteca no centro"
 *     responses:
 *       201:
 *         description: Biblioteca creada correctamente
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
 *         description: Já existe umha biblioteca con ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe umha biblioteca con ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/Biblioteca', BibliotecaController.putBiblioteca);

/**
 * @openapi
 * /Bibliotecas/Biblioteca:
 *   delete:
 *     tags: [Bibliotecas]
 *     summary: Elimina umha biblioteca
 *     description: Elimina umha biblioteca no sistema
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da biblioteca que se vai borrar
 *         example: 20
 *     responses:
 *       201:
 *         description: Biblioteca eliminada correctamente
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
 *                   example: "Nom tes permisos para eliminar esta biblioteca"
 *       404:
 *         description: Biblioteca nom atopada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Biblioteca nom atopada para este usuario"
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/Biblioteca', BibliotecaController.deleteBiblioteca);

export default router;
