import express from 'express';
const router = express.Router();
import UsuarioController from '../../controllers/usuarios.js';

router.get('/UsuarioPorNome', UsuarioController.getUsuarioPorNome);

router.post('/Usuario', UsuarioController.postUsuario);

router.post('/', UsuarioController.postLogin);

export default router;
