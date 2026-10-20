import editoriais from '../services/editoriais.js';

export class EditorialController {
  static async getAll(req, res, next) {
    try {
      res.json(await editoriais.getEditoriais(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as editoriais .`, err.message);
      next(err);
    }
  }

  static async getByNome(req, res, next) {
    try {
      res.json(await editoriais.getEditorialPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter a editorial polo nome .`, err.message);
      next(err);
    }
  }

  static async getEditoriaisCosLivros(req, res, next) {
    try {
      res.json(await editoriais.getEditoriaisCosLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as editoriais cos livros.`, err.message);
      next(err);
    }
  }

  static async getEditorial(req, res, next) {
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
      console.error(`Erro ao obter a editorial .`, err.message);
      next(err);
    }
  }

  static async postEditorial(req, res, next) {
    try {
      res.json(await editoriais.postEditorial(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando criar umha editorial.`, err.message);
      next(err);
    }
  }

  static async putEditorial(req, res, next) {
    try {
      res.json(await editoriais.putEditorial(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando actualizar umha editorial.`, err.message);
      next(err);
    }
  }
  
  static async deleteEditorial(req, res, next) {
    try {
      if (req.query.id != undefined)
        res.json(await editoriais.borrarEditorial(req.idUsuario, req.query.id));
      else
        console.error('Nom chegou o id');
    } catch (err) {
      console.error(`Erro tentando borrar umha editorial.`, err.message);
      next(err);
    }
  }
}

export default EditorialController;
  