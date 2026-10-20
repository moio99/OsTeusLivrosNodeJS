import express from 'express';
const router = express.Router();
import RelecturaController from '../../controllers/relecturas.js';

/**
 * @openapi
 * tags:
 *   - name: Relecturas
 *     description: Gestom das relecturas dos livros
 */

/* router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await relecturas.getColecons(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as relecturas .`, err.message);
    next(err);
  }
}); */

/**
 * @openapi
 * /Relecturas/Relectura:
 *   get:
 *     tags: [Relecturas]
 *     summary: Obtem umha relectura.
 *     description: Busca umha relectura do usuario autenticado polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da relectura.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Relectura', RelecturaController.getRelectura);

/**
 * @openapi
 * /Relecturas/Relecturas:
 *   get:
 *     tags: [Relecturas]
 *     summary: Obtem as relecturas dum livro.
 *     description: Devolve as relecturas do livro indicado que pertencen ao usuario autenticado.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do livro.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Relecturas', RelecturaController.getRelecturas);

/**
 * @openapi
 * /Relecturas/Relectura:
 *   post:
 *     tags: [Relecturas]
 *     summary: Engade umha relectura.
 *     description: Rexistra umha nova relectura dum livro para o usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idLivro, titulo]
 *             properties:
 *               idLivro:
 *                 type: integer
 *                 description: Identificador do livro lido de novo.
 *                 example: 1
 *               titulo:
 *                 type: string
 *                 description: Título do livro.
 *                 example: O livro
 *               idBiblioteca:
 *                 type: integer
 *                 nullable: true
 *               idEditorial:
 *                 type: integer
 *                 nullable: true
 *               idColecom:
 *                 type: integer
 *                 nullable: true
 *               isbn:
 *                 type: string
 *               electronico:
 *                 type: boolean
 *               paginas:
 *                 type: integer
 *               paginasLidas:
 *                 type: integer
 *               lido:
 *                 type: boolean
 *               diasLeitura:
 *                 type: integer
 *               dataFimLeitura:
 *                 type: string
 *                 format: date
 *               idIdioma:
 *                 type: integer
 *                 nullable: true
 *               dataEdicom:
 *                 type: string
 *                 format: date
 *               numeroEdicom:
 *                 type: integer
 *               comentario:
 *                 type: string
 *               pontuacom:
 *                 type: number
 *               somSerie:
 *                 type: boolean
 *               idSerie:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relectura creada correctamente.
 */
router.post('/Relectura', RelecturaController.postRelectura);

/**
 * @openapi
 * /Relecturas/Relectura:
 *   put:
 *     tags: [Relecturas]
 *     summary: Actualiza umha relectura.
 *     description: Actualiza os datos da relectura indicada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, titulo]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Identificador da relectura.
 *                 example: 1
 *               titulo:
 *                 type: string
 *               idBiblioteca:
 *                 type: integer
 *                 nullable: true
 *               idEditorial:
 *                 type: integer
 *                 nullable: true
 *               idColecom:
 *                 type: integer
 *                 nullable: true
 *               isbn:
 *                 type: string
 *               electronico:
 *                 type: boolean
 *               paginas:
 *                 type: integer
 *               paginasLidas:
 *                 type: integer
 *               lido:
 *                 type: boolean
 *               diasLeitura:
 *                 type: integer
 *               dataFimLeitura:
 *                 type: string
 *                 format: date
 *               idIdioma:
 *                 type: integer
 *                 nullable: true
 *               dataEdicom:
 *                 type: string
 *                 format: date
 *               numeroEdicom:
 *                 type: integer
 *               comentario:
 *                 type: string
 *               pontuacom:
 *                 type: number
 *               somSerie:
 *                 type: boolean
 *               idSerie:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relectura actualizada correctamente.
 */
router.put('/Relectura', RelecturaController.putRelectura);

/**
 * @openapi
 * /Relecturas/Relectura:
 *   delete:
 *     tags: [Relecturas]
 *     summary: Elimina umha relectura.
 *     description: Elimina a relectura do usuario autenticado co identificador indicado.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da relectura.
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitude de eliminación procesada.
 */
router.delete('/Relectura', RelecturaController.deleteRelectura);

export default router;
