const express = require('express');
const router = express.Router();
const livros = require('../services/livros');

/**
 * GET
 */
 router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivros());
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por última lectura.
 */
 router.get('/UltimaLectura', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosUltimaLectura());
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Idioma
 */
router.get('/PorIdioma', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorIdioma(req.query.Idioma));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Ano
 */
router.get('/PorAno', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorAno(req.query.Ano));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Autor
 */
router.get('/PorAutor', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorAutor(req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Genero
 */
router.get('/PorGenero', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorGenero(req.query.Genero));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Editorial
 */
router.get('/PorEditorial', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorEditorial(req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Biblioteca
 */
router.get('/PorBiblioteca', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorBiblioteca(req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Colecom
 */
router.get('/PorColecom', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorColecom(req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});


/**
 * GET Livro
 */
 router.get('/Livro', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivro(req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o livro `, err.message);
    next(err);
  }
});

/* POST Livro */
router.post('/Livro', async function(req, res, next) {
  try {
    res.json(await livros.postLivro(req.body));
  } catch (err) {
    console.error(`Erro tentando criar um livro`, err.message);
    next(err);
  }
});

/* PUT Livro */
router.put('/Livro', async function(req, res, next) {
  try {
    res.json(await livros.putLivro(req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar um livro`, err.message);
    next(err);
  }
});

/* DELETE Livro */
router.delete('/Livro', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await livros.borrarLivro(req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar um livro`, err.message);
    next(err);
  }
});
module.exports = router;