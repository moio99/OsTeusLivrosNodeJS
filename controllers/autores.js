import autores from '../services/autores.js';

export class AutorController {
  static async getAll(req, res, next) {
    try {
      res.json(await autores.getAutores(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os autores`, err.message);
      next(err);
    }
  }

  static async getAutoresFiltrados(req, res, next) {
    try {
      res.json(await autores.getAutoresFiltrados(req.idUsuario, req.query.id, req.query.tipo));
    } catch (err) {
      console.error(`Erro ao obter os autores filtrados`, err.message);
      next(err);
    }
  }

  static async getByNome(req, res, next) {
    try {
      res.json(await autores.getAutorPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter o autor polo nome`, err.message);
      next(err);
    }
  }

  static async getAutoresPorNacons(req, res, next) {
    try {
      res.json(await autores.getAutoresPorNacons(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as autores por naçons`, err.message);
      next(err);
    }
  }

  static async getAutoresPorPaises(req, res, next) {
    try {
      res.json(await autores.getAutoresPorPaises(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as autores por paises`, err.message);
      next(err);
    }
  }

  static async getAutoresCosLivros(req, res, next) {
    try {
      res.json(await autores.getAutoresCosLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os autores cos livros`, err.message);
      next(err);
    }
  }

  static async getAutor(req, res, next) {
    try {
      if (!req.idUsuario || !req.query.id) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
  
      const autoresResponse = await autores.getAutor(req.idUsuario, req.query.id);
      if (autoresResponse.data.length === 0) {
        return res.status(404).json({ error: 'Autor nom atopado' });
      }
  
      res.json(autoresResponse);
    } catch (err) {
      console.error(`Erro ao obter o autor`, err.message);
      next(err);
    }
  }

  static async postAutor(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await autores.postAutor(req.idUsuario, req.body));

    } catch (err) {
      console.error(`Erro tentando criar um autor`, err.message);
      next(err);
    }
  }

  static async putAutor(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await autores.putAutor(req.idUsuario, req.body));
      
  
    } catch (err) {
      console.error(`Erro tentando actualizar um autor`, err.message);
      next(err);
    }
  }
  
  static async deleteAutor(req, res, next) {
    try {
      if (!req.query.id) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await autores.borrarAutor(req.idUsuario, req.query.id));

    } catch (err) {
      console.error(`Erro tentando borrar um autor`, err.message);
      next(err);
    }
  }
}

export default AutorController;
