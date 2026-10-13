import outros from '../services/outros.js';

export class OutrosController {
  static async getNacionalidades(req, res, next) {
    try {
      res.json(await outros.getNacionalidades(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as nacionalidades`, err.message);
      next(err);
    }
  }

  static async getNacionalidadeNome(req, res, next) {
    try {
      res.json(await outros.getNacionalidadeNome(req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o nome da nacionalidade`, err.message);
      next(err);
    }
  }

  static async getPaises(req, res, next) {
    try {
      res.json(await outros.getPaises(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os paises`, err.message);
      next(err);
    }
  }

  static async getPaisNome(req, res, next) {
    try {
      res.json(await outros.getPaisNome(req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o nome do pais`, err.message);
      next(err);
    }
  }

  static async getAutores(req, res, next) {
    try {
      res.json(await outros.getAutores(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os autores`, err.message);
      next(err);
    }
  }

  static async getIdiomas(req, res, next) {
    try {
      res.json(await outros.getIdiomas());
    } catch (err) {
      console.error(`Erro ao obter os idiomas`, err.message);
      next(err);
    }
  }

  static async getIdiomaNome(req, res, next) {
    try {
      res.json(await outros.getIdiomaNome(req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o nome do idioma`, err.message);
      next(err);
    }
  }

  static async getBibliotecas(req, res, next) {
    try {
      res.json(await outros.getBibliotecas(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as bibliotecas`, err.message);
      next(err);
    }
  }

  static async getEditoriais(req, res, next) {
    try {
      res.json(await outros.getEditoriais(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as editoriais`, err.message);
      next(err);
    }
  }

  static async getGeneros(req, res, next) {
    try {
      res.json(await outros.getGeneros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os generos`, err.message);
      next(err);
    }
  }

  static async getColecons(req, res, next) {
    try {
      res.json(await outros.getColecons(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as coleçons`, err.message);
      next(err);
    }
  }

  static async getSeriesLivro(req, res, next) {
    try {
      res.json(await outros.getSeriesLivro(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as series de livros`, err.message);
      next(err);
    }
  }

  static async getTodo(req, res, next) {
    try {
      res.json(await outros.getTodo(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os dados de Outros`, err.message);
      next(err);
    }
  }
}

export default OutrosController;
