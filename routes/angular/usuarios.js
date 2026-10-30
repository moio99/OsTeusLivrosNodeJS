import express from 'express';
const router = express.Router();
import UsuarioController from '../../controllers/usuarios.js';

router.get('/UsuarioPorNome', UsuarioController.getUsuarioPorNome);

router.get('/UsuarioPorId', UsuarioController.getUsuarioPorId);

router.post('/Usuario', UsuarioController.postUsuario);

router.put('/Usuario', UsuarioController.putUsuario);

router.post('/', UsuarioController.postLogin);

export default router;
