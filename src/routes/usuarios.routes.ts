import { Router } from 'express';
import { getRepository } from 'typeorm';

import UsuariosController from '../app/controllers/UsuariosController';
import Usuarios from '../app/models/Usuarios';
import ensureAuthenticated from '../middleawares/ensureAuthenticated';

const usuariosRouter = Router();
usuariosRouter.use(ensureAuthenticated);

usuariosRouter.post('/', async (request, response) => {
  try {
    const { nome, email, password } = request.body;

    const usuariosController = new UsuariosController();

    const user = await usuariosController.store({
      nome,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (erro) {
    return response.status(400).json({ error: erro.message });
  }
});

usuariosRouter.get('/', async (request, response) => {
  const usuariosRepositorio = getRepository(Usuarios);
  const user = await usuariosRepositorio.find();
  console.log(request.user);
  delete user[0].password;
  return response.json(user);
});

usuariosRouter.get('/:id', async (request, response) => {
  const usuariosRepositorio = getRepository(Usuarios);
  const { id } = request.params;
  const user = await usuariosRepositorio.findOne(id);
  return response.json(user);
});

usuariosRouter.delete('/:id', async (request, response) => {
  const usuariosRepositorio = getRepository(Usuarios);
  const { id } = request.params;
  const user = await usuariosRepositorio.delete(id);
  return response.json(`O usuario com id: ${id} foi deletado !`);
});

export default usuariosRouter;
