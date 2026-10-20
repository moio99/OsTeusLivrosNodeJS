import estilosLiterarios from '../services/estilosLiterarios.js';

export class EstiloLiterarioController {
  static async getAll(req, res, next) {
    try {
      res.json(await estilosLiterarios.getEstilosLiterarios(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os estilos literarios.`, err.message);
      next(err);
    }
  }

  static async getEstilosLiterariosCosLivros(req, res, next) {
    try {
      res.json(await estilosLiterarios.getEstilosLiterariosCosLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os estilos literarios cos livros.`, err.message);
      next(err);
    }
  }

  static async getEstiloLiterario(req, res, next) {
    try {
      res.json(await estilosLiterarios.getEstilosLiterario(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o estilo literario.`, err.message);
      next(err);
    }
  }

  static async getEstiloLiterarioPorNome(req, res, next) {
    try {
      res.json(await estilosLiterarios.getEstiloLiterarioPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter o estilo literario polo nome.`, err.message);
      next(err);
    }
  }

  static async postEstiloLiterario(req, res, next) {
    try {
      res.json(await estilosLiterarios.postEstiloLiterario(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando crear um estilo literario.`, err.message);
      next(err);
    }
  }

  static async putEstiloLiterario(req, res, next) {
    try {
      res.json(await estilosLiterarios.putEstiloLiterario(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando actualizar um estilo literario.`, err.message);
      next(err);
    }
  }

  static async deleteEstiloLiterario(req, res, next) {
    try {
      if (req.query.id === undefined) {
        return res.status(400).json({ error: 'Falta o parámetro id' });
      }
      res.json(await estilosLiterarios.borrarEstiloLiterario(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro tentando eliminar um estilo literario.`, err.message);
      next(err);
    }
  }
}

export default EstiloLiterarioController;
