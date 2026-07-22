import express from 'express';
const router = express.Router();
import editoriais from '../services/editoriais.js';

/**
 * @openapi
 * tags:
 *   - name: Editoriais
 *     description: Gestom de editoriais
 */

/**
 * @openapi
 * /editoriais:
 *   get:
 *     tags: [Editoriais]
 *     description: Obtem o listado das editoriais.
 *     responses:
 *       200:
 *         description: Éxito total.
 *       400:
 *         description: Parámetros incorrectos
 *       404:
 *         description: Editorials nom encontradas
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    if (!req.idUsuario) {
      return res.status(400).json({ error: 'Faltam parámetros necesarios' });
    }

    res.json(await editoriais.getEditoriais(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as editoriais `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/EditorialPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await editoriais.getEditorialPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter a editorial polo nome `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/EditoriaisCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await editoriais.getEditoriaisCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as editoriais cos livros`, err.message);
    next(err);
  }
});

/**
 * @openapi
 * /editoriais/Editorial:
 *   get:
 *     tags: [Editoriais]
 *     description: Obtem umha editorial.
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
 router.get('/Editorial', async function(req, res, next) {
  try {
    if (!req.idUsuario || !req.query.id) {
      return res.status(400).json({ error: 'Faltam parámetros necesarios' });
    }

    const editorialResponse = await editoriais.getEditorial(req.idUsuario, req.query.id);
    if (editorialResponse.data.length === 0) {
      return res.status(404).json({ error: 'Editorial nom atopada' });
    }

    res.json(editorialResponse);
  } catch (err) {
    console.error(`Erro ao obter a editorial `, err.message);
    next(err);
  }
});

/* POST Editorial */
router.post('/Editorial', async function(req, res, next) {
  try {
    res.json(await editoriais.postEditorial(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha editorial`, err.message);
    next(err);
  }
});

/* PUT Editorial */
router.put('/Editorial', async function(req, res, next) {
  try {
    res.json(await editoriais.putEditorial(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar umha editorial`, err.message);
    next(err);
  }
});

/* DELETE Editorial */
router.delete('/Editorial', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await editoriais.borrarEditorial(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar umha editorial`, err.message);
    next(err);
  }
});

export default router;