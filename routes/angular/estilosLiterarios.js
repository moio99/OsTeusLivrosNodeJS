import express from 'express';
const router = express.Router();
import EstiloLiterarioController from '../../controllers/estilosLiterarios.js';

/**
 * @openapi
 * tags:
 *   - name: Estilos literarios
 *     description: Gestom dos estilos literarios
 */

/**
 * @openapi
 * /EstilosLiterarios:
 *   get:
 *     tags: [Estilos literarios]
 *     summary: Obtem os estilos literarios.
 *     description: Devolve a lista de estilos literarios do usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/', EstiloLiterarioController.getAll);


/**
 * @openapi
 * /EstilosLiterarios/EstilosLiterariosCosLivros:
 *   get:
 *     tags: [Estilos literarios]
 *     summary: Obtem os estilos literarios cos seus livros.
 *     description: Devolve os estilos literarios xunto co número de livros asociados.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/EstilosLiterariosCosLivros', EstiloLiterarioController.getEstilosLiterariosCosLivros);

/**
 * @openapi
 * /EstilosLiterarios/EstiloLiterario:
 *   get:
 *     tags: [Estilos literarios]
 *     summary: Obtem um estilo literario.
 *     description: Busca um estilo literario polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do estilo literario.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/EstiloLiterario', EstiloLiterarioController.getEstiloLiterario);

/**
 * @openapi
 * /EstilosLiterarios/EstiloLiterarioPorNome:
 *   get:
 *     tags: [Estilos literarios]
 *     summary: Busca estilos literarios polo nome.
 *     description: Devolve os estilos literarios do usuario que coinciden co nome indicado.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome ou parte do nome que se quere buscar.
 *         example: Narrativa
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/EstiloLiterarioPorNome', EstiloLiterarioController.getEstiloLiterarioPorNome);

/**
 * @openapi
 * /EstilosLiterarios/EstiloLiterario:
 *   post:
 *     tags: [Estilos literarios]
 *     summary: Crea um estilo literario.
 *     description: Engade um novo estilo literario para o usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do estilo literario.
 *                 example: Narrativa
 *               comentario:
 *                 type: string
 *                 nullable: true
 *                 description: Comentario opcional.
 *     responses:
 *       200:
 *         description: Estilo literario creado correctamente.
 */
router.post('/EstiloLiterario', EstiloLiterarioController.postEstiloLiterario);

/**
 * @openapi
 * /EstilosLiterarios/EstiloLiterario:
 *   put:
 *     tags: [Estilos literarios]
 *     summary: Actualiza um estilo literario.
 *     description: Actualiza o nome e o comentario do estilo indicado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, nome]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Identificador do estilo literario.
 *                 example: 1
 *               nome:
 *                 type: string
 *                 description: Novo nome do estilo literario.
 *                 example: Narrativa
 *               comentario:
 *                 type: string
 *                 nullable: true
 *                 description: Comentario opcional.
 *     responses:
 *       200:
 *         description: Estilo literario actualizado correctamente.
 */
router.put('/EstiloLiterario', EstiloLiterarioController.putEstiloLiterario);

/**
 * @openapi
 * /EstilosLiterarios/EstiloLiterario:
 *   delete:
 *     tags: [Estilos literarios]
 *     summary: Elimina um estilo literario.
 *     description: Elimina o estilo literario do usuario autenticado co identificador indicado.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do estilo literario.
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitude de eliminación procesada.
 */
router.delete('/EstiloLiterario', EstiloLiterarioController.deleteEstiloLiterario);

export default router;
