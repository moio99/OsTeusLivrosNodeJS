import express from 'express';
const router = express.Router();
import LivroController from '../../controllers/livros.js';

/**
 * @openapi
 * tags:
 *   - name: Livros
 *     description: Gestom e consulta dos livros
 */

/**
 * @openapi
 * /Livros:
 *   get:
 *     tags: [Livros]
 *     summary: Obtem os livros.
 *     description: Devolve a lista de livros do usuario autenticado.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/', LivroController.getAll);

/**
 * @openapi
 * /Livros/LivrosParaMovel:
 *   get:
 *     tags: [Livros]
 *     summary: Obtem os livros para a aplicaçom móvel.
 *     description: Devolve o listado de livros no formato que precisa o móvel móvel. Cháma-se dende paginasHTML\taboaLivrosHtml.js.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 *       404:
 *         description: Endpoint non disponhivel nesta contorna.
 */
router.get('/LivrosParaMovel', LivroController.getLivrosParaMovel);

/**
 * @openapi
 * /Livros/LivroPorTitulo:
 *   get:
 *     tags: [Livros]
 *     summary: Busca livros polo título.
 *     description: Devolve os livros do usuario cuxo título coincide coa busca indicada.
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título ou texto que se quere buscar.
 *         example: A illa
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/LivroPorTitulo', LivroController.getLivroPorTitulo);

/**
 * @openapi
 * /Livros/UltimaLectura:
 *   get:
 *     tags: [Livros]
 *     summary: Obtem os livros da última lectura.
 *     description: Devolve os livros do usuario asociados á súa última lectura.
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/UltimaLectura', LivroController.getUltimaLectura);

/**
 * @openapi
 * /Livros/PorIdioma:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por idioma.
 *     description: Devolve os livros do usuario no idioma indicado.
 *     parameters:
 *       - in: query
 *         name: Idioma
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do idioma.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorIdioma', LivroController.getPorIdioma);

/**
 * @openapi
 * /Livros/PorAno:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por ano.
 *     description: Devolve os livros do usuario publicados no ano indicado.
 *     parameters:
 *       - in: query
 *         name: Ano
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ano de publicación.
 *         example: 2024
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorAno', LivroController.getPorAno);

/**
 * @openapi
 * /Livros/PorAutor:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por autor.
 *     description: Devolve os livros do usuario asociados ao autor indicado.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do autor.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorAutor', LivroController.getPorAutor);

/**
 * @openapi
 * /Livros/PorGenero:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por género.
 *     description: Devolve os livros do usuario asociados ao género indicado.
 *     parameters:
 *       - in: query
 *         name: Genero
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do género.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorGenero', LivroController.getPorGenero);

/**
 * @openapi
 * /Livros/PorEditorial:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por editorial.
 *     description: Devolve os livros do usuario asociados á editorial indicada.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da editorial.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorEditorial', LivroController.getPorEditorial);

/**
 * @openapi
 * /Livros/PorBiblioteca:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por biblioteca.
 *     description: Devolve os livros do usuario asociados á biblioteca indicada.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da biblioteca.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorBiblioteca', LivroController.getPorBiblioteca);

/**
 * @openapi
 * /Livros/PorColecom:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por colecçom.
 *     description: Devolve os livros do usuario asociados á colecçom indicada.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da colecçom.
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente.
 */
router.get('/PorColecom', LivroController.getPorColecom);

/**
 * @openapi
 * /Livros/PorEstiloLiterario:
 *   get:
 *     tags: [Livros]
 *     summary: Filtra os livros por estilo literario.
 *     description: Devolve os livros do usuario asociados ao estilo literario indicado.
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
router.get('/PorEstiloLiterario', LivroController.getPorEstiloLiterario);

/**
 * @openapi
 * /Livros/Livro:
 *   get:
 *     tags: [Livros]
 *     summary: Obtem um livro.
 *     description: Busca um livro do usuario polo seu identificador.
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
router.get('/Livro', LivroController.getLivro);

/**
 * @openapi
 * /Livros/Livro:
 *   post:
 *     tags: [Livros]
 *     summary: Engade um livro.
 *     description: Rexistra um livro novo para o usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, autores, generos]
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do livro.
 *                 example: O livro
 *               tituloOriginal:
 *                 type: string
 *                 nullable: true
 *               idBiblioteca:
 *                 type: integer
 *                 nullable: true
 *               idEditorial:
 *                 type: integer
 *                 nullable: true
 *               idColecom:
 *                 type: integer
 *                 nullable: true
 *               idEstilo:
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
 *               idIdiomaOriginal:
 *                 type: integer
 *                 nullable: true
 *               dataCriacom:
 *                 type: string
 *                 format: date
 *               dataEdicom:
 *                 type: string
 *                 format: date
 *               numeroEdicom:
 *                 type: integer
 *               premios:
 *                 type: string
 *               descricom:
 *                 type: string
 *               comentario:
 *                 type: string
 *               pontuacom:
 *                 type: number
 *               somSerie:
 *                 type: boolean
 *               idSerie:
 *                 type: integer
 *               autores:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Identificadores dos autores asociados.
 *               generos:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Identificadores dos géneros asociados.
 *     responses:
 *       200:
 *         description: Livro creado correctamente.
 */
router.post('/Livro', LivroController.postLivro);

/**
 * @openapi
 * /Livros/Livro:
 *   put:
 *     tags: [Livros]
 *     summary: Actualiza um livro.
 *     description: Actualiza os datos do livro indicado e as súas asociacións con autores e géneros.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, titulo, autores, generos]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Identificador do livro.
 *                 example: 1
 *               titulo:
 *                 type: string
 *               tituloOriginal:
 *                 type: string
 *                 nullable: true
 *               idBiblioteca:
 *                 type: integer
 *                 nullable: true
 *               idEditorial:
 *                 type: integer
 *                 nullable: true
 *               idColecom:
 *                 type: integer
 *                 nullable: true
 *               idEstilo:
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
 *               idIdiomaOriginal:
 *                 type: integer
 *                 nullable: true
 *               dataCriacom:
 *                 type: string
 *                 format: date
 *               dataEdicom:
 *                 type: string
 *                 format: date
 *               numeroEdicom:
 *                 type: integer
 *               premios:
 *                 type: string
 *               descricom:
 *                 type: string
 *               comentario:
 *                 type: string
 *               pontuacom:
 *                 type: number
 *               somSerie:
 *                 type: boolean
 *               idSerie:
 *                 type: integer
 *               autores:
 *                 type: array
 *                 items:
 *                   type: integer
 *               generos:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Livro actualizado correctamente.
 */
router.put('/Livro', LivroController.putLivro);

/**
 * @openapi
 * /Livros/Livro:
 *   delete:
 *     tags: [Livros]
 *     summary: Elimina um livro.
 *     description: Elimina o livro do usuario autenticado co identificador indicado.
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
 *         description: Solicitude de eliminación procesada.
 */
router.delete('/Livro', LivroController.deleteLivro);
export default router;
