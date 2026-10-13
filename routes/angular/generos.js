import express from 'express';
const router = express.Router();
import GeneroController from '../../controllers/generos.js';

/**
 * @openapi
 * tags:
 *   - name: Géneros
 *     description: Gestom dos géneros literarios
 */

/**
 * @openapi
 * /Generos:
 *   get:
 *     tags: [Géneros]
 *     summary: Obtem os géneros.
 *     description: Devolve a lista de géneros do usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/', GeneroController.getAll);


/**
 * @openapi
 * /Generos/GenerosCosLivros:
 *   get:
 *     tags: [Géneros]
 *     summary: Obtem os géneros cos seus livros.
 *     description: Devolve os géneros xunto co número de livros asociados e lidos.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/GenerosCosLivros', GeneroController.getGenerosCosLivros);

/**
 * @openapi
 * /Generos/Genero:
 *   get:
 *     tags: [Géneros]
 *     summary: Obtem um género.
 *     description: Busca um género polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do género.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Genero', GeneroController.getGenero);

/**
 * @openapi
 * /Generos/GeneroPorNome:
 *   get:
 *     tags: [Géneros]
 *     summary: Busca um género polo nome.
 *     description: Busca o género do usuario que coincide co nome indicado.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do género que se quere buscar.
 *         example: Fantasia
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/GeneroPorNome', GeneroController.getGeneroPorNome);

/**
 * @openapi
 * /Generos/GeneroNome:
 *   get:
 *     tags: [Géneros]
 *     summary: Obtem o nome dum género.
 *     description: Busca o nome do género polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do género.
 *         example: 1
 *     responses:
 *       200:
 *         description: Nome do género devolto correctamente.
 */
router.get('/GeneroNome', GeneroController.getGeneroNome);

/**
 * @openapi
 * /Generos/Genero:
 *   post:
 *     tags: [Géneros]
 *     summary: Crea um género.
 *     description: Engade um novo género para o usuario autenticado.
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
 *                 description: Nome do género.
 *                 example: Fantasia
 *               comentario:
 *                 type: string
 *                 nullable: true
 *                 description: Comentario opcional.
 *     responses:
 *       200:
 *         description: Género creado correctamente.
 */
router.post('/Genero', GeneroController.postGenero);

/**
 * @openapi
 * /Generos/Genero:
 *   put:
 *     tags: [Géneros]
 *     summary: Actualiza um género.
 *     description: Actualiza o nome e o comentario do género indicado.
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
 *                 description: Identificador do género.
 *                 example: 1
 *               nome:
 *                 type: string
 *                 description: Novo nome do género.
 *                 example: Fantasia
 *               comentario:
 *                 type: string
 *                 nullable: true
 *                 description: Comentario opcional.
 *     responses:
 *       200:
 *         description: Género actualizado correctamente.
 */
router.put('/Genero', GeneroController.putGenero);

/**
 * @openapi
 * /Generos/Genero:
 *   delete:
 *     tags: [Géneros]
 *     summary: Elimina um género.
 *     description: Elimina o género do usuario autenticado co identificador indicado.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do género.
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitude de eliminación procesada.
 */
router.delete('/Genero', GeneroController.deleteGenero);

export default router;
