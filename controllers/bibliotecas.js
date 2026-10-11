import bibliotecas from '../services/bibliotecas.js';

export class BibliotecaController {
  static async getAll(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await bibliotecas.getBibliotecas(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as bibliotecas `, err.message);
      next(err);
    }
  }

  static async getByNome(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await bibliotecas.getBibliotecaPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter a bibliotecas polo nome `, err.message);
      next(err);
    }
  }

  static async getBibliotecasCosLivros(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await bibliotecas.getBibliotecasCosLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as bibliotecas cos livros`, err.message);
      next(err);
    }
  }

  static async getBiblioteca(req, res, next) {
    try {
      if (!req.idUsuario || !req.query.id) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
  
      const bibliotecasResponse = await bibliotecas.getBiblioteca(req.idUsuario, req.query.id);
      if (bibliotecasResponse.data.length === 0) {
        return res.status(404).json({ error: 'Biblioteca nom atopada' });
      }
  
      res.json(bibliotecasResponse);
    } catch (err) {
      console.error(`Erro ao obter a biblioteca`, err.message);
      next(err);
    }
  }

  static async postBiblioteca(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await bibliotecas.postBiblioteca(req.idUsuario, req.body));

    } catch (err) {
      console.error(`Erro tentando criar umha biblioteca`, err.message);
      next(err);
    }
  }

  static async putBiblioteca(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await bibliotecas.putBiblioteca(req.idUsuario, req.body));
      
  
    } catch (err) {
      console.error(`Erro tentando actualizar umha biblioteca`, err.message);
      next(err);
    }
  }
  
  static async deleteBiblioteca(req, res, next) {
    try {
      if (!req.query.id) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await bibliotecas.borrarBiblioteca(req.idUsuario, req.query.id));

    } catch (err) {
      console.error(`Erro tentando borrar umha biblioteca`, err.message);
      next(err);
    }
  }
}

export default BibliotecaController;
