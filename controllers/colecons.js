import colecons from '../services/colecons.js';

export class ColecomController {
  static async getAll(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await colecons.getColecons(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as coleçons `, err.message);
      next(err);
    }
  }

  static async getByNome(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await colecons.getColecomPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter a coleçons polo nome `, err.message);
      next(err);
    }
  }

  static async getColeconsCosLivros(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await colecons.getColeconsCosLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as coleçons cos livros`, err.message);
      next(err);
    }
  }

  static async getColecom(req, res, next) {
    try {
      if (!req.idUsuario || !req.query.id) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
  
      const coleconsResponse = await colecons.getColecom(req.idUsuario, req.query.id);
      if (coleconsResponse.data.length === 0) {
        return res.status(404).json({ error: 'Coleçom nom atopada' });
      }
  
      res.json(coleconsResponse);
    } catch (err) {
      console.error(`Erro ao obter a coleçom`, err.message);
      next(err);
    }
  }

  static async postColecom(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await colecons.postColecom(req.idUsuario, req.body));

    } catch (err) {
      console.error(`Erro tentando criar umha coleçom`, err.message);
      next(err);
    }
  }

  static async putColecom(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await colecons.putColecom(req.idUsuario, req.body));
      
  
    } catch (err) {
      console.error(`Erro tentando actualizar umha coleçom`, err.message);
      next(err);
    }
  }
  
  static async deleteColecom(req, res, next) {
    try {
      if (!req.query.id) {
        return res.status(400).json({ error: 'Faltam parámetros necesarios' });
      }
      else
        res.json(await colecons.borrarColecom(req.idUsuario, req.query.id));

    } catch (err) {
      console.error(`Erro tentando borrar umha coleçom`, err.message);
      next(err);
    }
  }
}

export default ColecomController;
