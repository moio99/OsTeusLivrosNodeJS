import express from 'express';
const router = express.Router();
import bibliotecas from '../../services/bibliotecas.js';

import BibliotecaController from '../../controllers/bibliotecas.js'

router.get('/', BibliotecaController.getAll);
router.get('/BibliotecaPorNome', BibliotecaController.getByNome);


/**
 * GET
 */
 router.get('/BibliotecasCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await bibliotecas.getBibliotecasCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as bibliotecas cos livros`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/Biblioteca', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await bibliotecas.getBiblioteca(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter a biblioteca `, err.message);
    next(err);
  }
});

/* POST Biblioteca */
router.post('/Biblioteca', async function(req, res, next) {
  try {
    res.json(await bibliotecas.postBiblioteca(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha biblioteca`, err.message);
    next(err);
  }
});

/* PUT Biblioteca */
router.put('/Biblioteca', async function(req, res, next) {
  try {
    res.json(await bibliotecas.putBiblioteca(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar umha biblioteca`, err.message);
    next(err);
  }
});

/* DELETE Biblioteca */
router.delete('/Biblioteca', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await bibliotecas.borrarBiblioteca(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar umha biblioteca`, err.message);
    next(err);
  }
});

export default router;
