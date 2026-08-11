import express from 'express';
const router = express.Router();
import colecons from '../services/colecons.js';

/**
 * @openapi
 * tags:
 *   - name: Coleçons
 *     description: Gestom de coleçons
 */

/**
 * GET
 */
router.get('/ColecomPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await colecons.getColecomPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter a colecom polo nome `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/ColeconsCosLivros', async function(req, res, next) {
  try {
    res.json(await colecons.getColeconsCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as colecons cos livros`, err.message);
    next(err);
  }
});

/**
 * @openapi
 * /colecons/Colecom:
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
 router.get('/Colecom', async function(req, res, next) {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: 'Faltam parámetros necesarios' });
    }
    res.json(await colecons.getColecom(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter a colecom `, err.message);
    next(err);
  }
});

/**
 * @openapi
 * /colecons/Colecom:
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
 *                 mensagem:
 *                   type: string
 *                   example: "Coleçom creada correctamente"
 *                 colecom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     nome:
 *                       type: string
 *                       example: "Coleçom mini"
 *                     isbn:
 *                       type: string
 *                       example: "12-3456-789"
 *                     web:
 *                       type: string
 *                       example: "www.editorialgalaxia.com/mini"
 *                     comentario:
 *                       type: string
 *                       example: "A coleçom dos livros pequenos"
 *                     idUsuario:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Datos incorrectos ou incompletos
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
router.post('/Colecom', async function(req, res, next) {
  try {
    res.json(await colecons.postColecom(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha colecom`, err.message);
    next(err);
  }
});

/**
 * @openapi
 * /colecons/Colecom:
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
 *               - isbn
 *               - web
 *               - comentario
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
 *                 mensagem:
 *                   type: string
 *                   example: "Coleçom creada correctamente"
 *                 colecom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     nome:
 *                       type: string
 *                       example: "Coleçom mini"
 *                     isbn:
 *                       type: string
 *                       example: "12-3456-789"
 *                     web:
 *                       type: string
 *                       example: "www.editorialgalaxia.com/mini"
 *                     comentario:
 *                       type: string
 *                       example: "A coleçom dos livros pequenos"
 *                     idUsuario:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Datos incorrectos ou incompletos
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
router.put('/Colecom', async function(req, res, next) {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Faltam parámetros necesarios' });
    }
    else
      res.json(await colecons.putColecom(req.idUsuario, req.body));
    

  } catch (err) {
    console.error(`Erro tentando actualizar umha colecom`, err.message);
    next(err);
  }
});

/**
 * @openapi
 * /colecons/Colecom:
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
 *                 mensagem:
 *                   type: string
 *                   example: "Coleçom eliminada correctamente"
 *                 colecom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 20
 *                     nome:
 *                       type: string
 *                       example: "Coleçom mini"
 *                     isbn:
 *                       type: string
 *                       example: "12-3456-789"
 *                     web:
 *                       type: string
 *                       example: "www.editorialgalaxia.com/mini"
 *                     comentario:
 *                       type: string
 *                       example: "A coleçom dos livros pequenos"
 *                     idUsuario:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Datos incorrectos ou incompletos
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
router.delete('/Colecom', async function(req, res, next) {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: 'Faltam parámetros necesarios' });
    }
    else
      res.json(await colecons.borrarColecom(req.idUsuario, req.query.id));
    
  } catch (err) {
    console.error(`Erro tentando borrar umha colecom`, err.message);
    next(err);
  }
});

export default router;
