import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import Usuarios from '../models/Usuarios';

interface Request {
  nome: string;
  email: string;
  password: string;
}

class UsuariosController {
  // retorna o model dentro da Promise
  public async store({ nome, email, password }: Request): Promise<Usuarios> {
    const usuariosRepository = getRepository(Usuarios);

    // checar se o email já existe

    const verificaUsuarioExiste = await usuariosRepository.findOne({
      where: { email },
    });

    if (verificaUsuarioExiste) {
      throw new Error('Endereço de email já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const user = usuariosRepository.create({
      nome,
      email,
      password: hashedPassword,
    });

    await usuariosRepository.save(user); // salvar o usuario

    return user;
  }
}

export default UsuariosController;
