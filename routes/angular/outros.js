import express from 'express';
const router = express.Router();
import OutrosController from '../../controllers/outros.js';

/**
 * @openapi
 * tags:
 *   - name: Outros
 *     description: Consultas de datos auxiliares
 */

/**
 * @openapi
 * /Outros/Nacionalidades:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem as nacionalidades.
 *     description: Devolve a lista de nacionalidades dispoñibles.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Nacionalidades', OutrosController.getNacionalidades);

/**
 * @openapi
 * /Outros/NacionalidadeNome:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem o nome dunha nacionalidade.
 *     description: Busca o nome da nacionalidade polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da nacionalidade.
 *         example: 1
 *     responses:
 *       200:
 *         description: Nome da nacionalidade devolto correctamente.
 */
router.get('/NacionalidadeNome', OutrosController.getNacionalidadeNome);

/**
 * @openapi
 * /Outros/Paises:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem os países.
 *     description: Devolve a lista de países dispoñibles.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Paises', OutrosController.getPaises);

/**
 * @openapi
 * /Outros/PaisNome:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem o nome dum país.
 *     description: Busca o nome do país polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do país.
 *         example: 1
 *     responses:
 *       200:
 *         description: Nome do país devolto correctamente.
 */
router.get('/PaisNome', OutrosController.getPaisNome);

/**
 * @openapi
 * /Outros/Autores:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem os autores do usuario.
 *     description: Devolve a lista de autores asociados ao usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Autores', OutrosController.getAutores);

/**
 * @openapi
 * /Outros/Idiomas:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem os idiomas.
 *     description: Devolve a lista de idiomas dispoñibles.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Idiomas', OutrosController.getIdiomas);

/**
 * @openapi
 * /Outros/IdiomaNome:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem o nome dum idioma.
 *     description: Busca o nome do idioma polo seu identificador.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do idioma.
 *         example: 1
 *     responses:
 *       200:
 *         description: Nome do idioma devolto correctamente.
 */
router.get('/IdiomaNome', OutrosController.getIdiomaNome);

/**
 * @openapi
 * /Outros/Bibliotecas:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem as bibliotecas do usuario.
 *     description: Devolve a lista de bibliotecas asociadas ao usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Bibliotecas', OutrosController.getBibliotecas);

/**
 * @openapi
 * /Outros/Editoriais:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem as editoriais do usuario.
 *     description: Devolve a lista de editoriais asociadas ao usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Editoriais', OutrosController.getEditoriais);

/**
 * @openapi
 * /Outros/Generos:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem os géneros do usuario.
 *     description: Devolve a lista de géneros asociados ao usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Generos', OutrosController.getGeneros);

/**
 * @openapi
 * /Outros/Colecons:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem as coleccións do usuario.
 *     description: Devolve a lista de coleccións asociadas ao usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Colecons', OutrosController.getColecons);

/**
 * @openapi
 * /Outros/SeriesLivro:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem os livros que son cabeceira dunha serie.
 *     description: Devolve os livros do usuario que inician unha serie.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/SeriesLivro', OutrosController.getSeriesLivro);

/**
 * @openapi
 * /Outros/Todo:
 *   get:
 *     tags: [Outros]
 *     summary: Obtem todos os datos auxiliares.
 *     description: Devolve nunha única resposta os datos auxiliares do usuario e os datos xerais necesarios.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/Todo', OutrosController.getTodo);

export default router;
