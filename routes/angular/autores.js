import express from 'express';
const router = express.Router();
import AutorController from '../../controllers/autores.js'

/**
 * @openapi
 * tags:
 *   - name: Autores
 *     description: Gestom de autores
 */

/**
 * @openapi
 * /Autores:
 *   get:
 *     tags: [Autores]
 *     summary: Obtem o listado das autores.
 *     description: Obtem o listado básico das autores.
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorials nom encontradas
 */
router.get('/', AutorController.getAll);

/**
 * @openapi
 * /Autores/AutorPorNome:
 *   get:
 *     tags: [Autores]
 *     summary: Obtem um autor
 *     description: Filtra polo nome do autor.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do autor
 *         example: 'Albert Camus'
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorial nom atopada
 */
router.get('/AutorPorNome', AutorController.getByNome);

/**
 * @openapi
 * /Autores/AutoresFiltrados:
 *   get:
 *     tags: [Autores]
 *     summary: Listado de autores filtrados.
 *     description: Um listado de autores cos livros filtrado por nacionalidade ou por pais.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da nacionalidade ou do pais
 *         example: 2
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: integer
 *         description: tipo do filtro 1 para nacionalidade, 2 para pais
 *         example: 1
 *     responses:
 *       200:
 *         description: Éxito total.
 */
router.get('/AutoresFiltrados', AutorController.getAutoresFiltrados);

/**
 * @openapi
 * /Autores/AutoresPorNacons:
 *   get:
 *     tags: [Autores]
 *     summary: Listado de autores por nacionalidade.
 *     description: Um listado de autores cos livros pola nacionalidade.
 *     responses:
 *       200:
 *         description: Éxito total.
 */
router.get('/AutoresPorNacons', AutorController.getAutoresPorNacons);

/**
 * @openapi
 * /Autores/AutoresPorPaises:
 *   get:
 *     tags: [Autores]
 *     summary: Listado de autores por paises.
 *     description: Um listado de autores cos livros polo pais.
 *     responses:
 *       200:
 *         description: Éxito total.
 */
router.get('/AutoresPorPaises', AutorController.getAutoresPorPaises);

/**
 * @openapi
 * /Autores/Autor:
 *   get:
 *     tags: [Autores]
 *     summary: Obtem um autor concreta
 *     description: Obtem um autor polo id.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do autor
 *         example: 56
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Autor nom atopada
 */
router.get('/Autor', AutorController.getAutor);

/**
 * @openapi
 * /Autores/Autor:
 *   post:
 *     tags: [Autores]
 *     summary: Crea umha nova autor
 *     description: Registra umha nova autor no sistema
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
 *                 description: Nome do autor
 *                 example: "Samuel Beckett"
 *               nomeReal:
 *                 type: string
 *                 description: Nome real do autor
 *                 example: "Samuel Barclay Beckett"
 *               lugarNacemento:
 *                 type: string
 *                 description: Lugar de nacemento do autor
 *                 example: "Dublim"
 *               dataNacemento:
 *                 type: date-time
 *                 description: Data da renovaçom no autor
 *                 example: "1906-04-13"
 *               dataDefuncom:
 *                 type: date-time
 *                 description: Data da renovaçom no autor
 *                 example: "1989-12-22"
 *               comentario:
 *                 type: string
 *                 description: endereço do autor
 *                 example: "Premio Nobel de Literatura no 1969"
 *               web:
 *                 type: string
 *                 description: localidade do autor
 *                 example: "nada"
 *               idNacionalidade:
 *                 type: integer
 *                 description: Id da nacionalidade do autor
 *                 example: 149
 *               nomeNacionalidade:
 *                 type: string
 *                 description: nacionalidade do autor
 *                 example: "Irish"
 *               idPais:
 *                 type: integer
 *                 description: Id do pais do autor
 *                 example: 68
 *               nomePais:
 *                 type: string
 *                 description: pais do autor
 *                 example: "Ireland"
 *               quantidade:
 *                 type: integer
 *                 description: quantidade de livros lidos do autor
 *                 example: 5
 *     responses:
 *       201:
 *         description: Autor creado correctamente
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
 *         description: Já existe um autor com ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe um autor com ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/Autor', AutorController.postAutor);

/**
 * @openapi
 * /Autores/Autor:
 *   put:
 *     tags: [Autores]
 *     summary: Actualiza um autor
 *     description: Modifica um autor no sistema
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
 *                 description: ID do autor
 *                 example: 3
 *               nome:
 *                 type: string
 *                 description: Nome do autor
 *                 example: "Samuel Beckett"
 *               nomeReal:
 *                 type: string
 *                 description: Nome real do autor
 *                 example: "Samuel Barclay Beckett"
 *               lugarNacemento:
 *                 type: string
 *                 description: Lugar de nacemento do autor
 *                 example: "Dublim"
 *               dataNacemento:
 *                 type: date-time
 *                 description: Data da renovaçom no autor
 *                 example: "1906-04-13"
 *               dataDefuncom:
 *                 type: date-time
 *                 description: Data da renovaçom no autor
 *                 example: "1989-12-22"
 *               comentario:
 *                 type: string
 *                 description: endereço do autor
 *                 example: "Premio Nobel de Literatura no 1969"
 *               web:
 *                 type: string
 *                 description: localidade do autor
 *                 example: "nada"
 *               idNacionalidade:
 *                 type: integer
 *                 description: Id da nacionalidade do autor
 *                 example: 149
 *               nomeNacionalidade:
 *                 type: string
 *                 description: nacionalidade do autor
 *                 example: "Irish"
 *               idPais:
 *                 type: integer
 *                 description: Id do pais do autor
 *                 example: 68
 *               nomePais:
 *                 type: string
 *                 description: pais do autor
 *                 example: "Ireland"
 *               quantidade:
 *                 type: integer
 *                 description: quantidade de livros lidos do autor
 *                 example: 5
 *     responses:
 *       201:
 *         description: Autor creada correctamente
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
 *         description: Já existe um autor con ese nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Já existe um autor con ese nome"
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/Autor', AutorController.putAutor);

/**
 * @openapi
 * /Autores/Autor:
 *   delete:
 *     tags: [Autores]
 *     summary: Elimina um autor
 *     description: Elimina um autor no sistema
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do autor que se vai borrar
 *         example: 20
 *     responses:
 *       201:
 *         description: Autor eliminada correctamente
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
 *                   example: "Nom tes permisos para eliminar esta autor"
 *       404:
 *         description: Autor nom atopada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Autor nom atopada para este usuario"
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/Autor', AutorController.deleteAutor);

export default router;