import usuarios from '../services/usuarios.js';

export class UsuarioController {
  
  static async getUsuarioPorNome(req, res, next) {
    try {
      res.json(await usuarios.getUsuarioPorNome(req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter o usuario polo nome.`, err.message);
      next(err);
    }
  }
  
  static async getUsuarioPorId(req, res, next) {
    try {
      res.json(await usuarios.getUsuarioPorId(req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o usuario polo id.`, err.message);
      next(err);
    }
  }
  
  static async postUsuario(req, res, next) {
    try {
      res.json(await usuarios.postUsuario(req.body));
    } catch (err) {
      console.error(`Erro tentando crear um usuario.`, err.message);
      next(err);
    }
  }

  static async postLogin(req, res, next) {
    try {
      let loginSwagger = false;
      let { nome, contrasinal } = req.body
      const { username, password } = req.body; // Swagger enviará isto no body

      if (username && password) {
        loginSwagger = true;
        nome = username;
        contrasinal = password;
      }

      if (!(nome && contrasinal)) {
        return response.status(401).json({
          error: 'inválidos nome do usuario ou contrasinal'
        })
      }

      res.json(await usuarios.postLogin(nome, contrasinal, loginSwagger));
    } catch (err) {
      console.error(`Erro tentando fazer o login.`, err.message);
      next(err);
    }
  }

  static async putUsuario(req, res, next) {
    try {
      res.json(await usuarios.putUsuario(req.body));
    } catch (err) {
      console.error(`Erro tentando actualizar um usuario.`, err.message);
      next(err);
    }
  }
}

export default UsuarioController;
