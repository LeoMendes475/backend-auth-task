import Router from '@koa/router';
import authMiddleware from '../../config/middlewares/authMiddleware';
import { listAllUsersUseCase } from '../../application/use-cases/user/list-all-users.use-case';
import { SignInOrRegisterUseCase } from '../../application/use-cases/user/sign-in-or-register.use-case';
import { CognitoAuthService } from '../../domain/services/cognitoAuthService';
import { UserRepository } from '../../adapters/repositories/UserRepository';
import { EditUserAccountUseCase } from '../../application/use-cases/user/edit-user.use-case';

const router = new Router({
  prefix: '/users',
});

const authService = new CognitoAuthService();
const userRepository = new UserRepository();

const signInOrRegisterUseCase = new SignInOrRegisterUseCase(userRepository, authService);
const editUserAccountUseCase = new EditUserAccountUseCase(userRepository)


router.post('/auth', async (ctx: any) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'E-mail e senha são obrigatórios' };
    return;
  }

  try {
    const { user, tokens } = await signInOrRegisterUseCase.execute(email, password);
    ctx.status = 200;
    ctx.body = { message: 'Autenticação realizada com sucesso', user, tokens };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Erro ao autenticar usuário', error: error };
  }
});


router.get('/me', authMiddleware, async (ctx) => {
  const userId = ctx.state.user.id;

  try {
    const user = userRepository.findById(userId)

    ctx.status = 200;
    ctx.body = { user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Erro no servidor', error: error };
  }
});

router.put('/edit-account', authMiddleware, async (ctx: any) => {
  const userId = ctx.state.user.id;
  const { name, role } = ctx.request.body;
  const userRole = ctx.state.user.role;

  try {
    if (!name) {
      ctx.status = 400;
      ctx.body = { message: 'Nome é obrigatório.' };
      return;
    }

    if (userRole === 'admin') {
      if (!role) {
        ctx.status = 400;
        ctx.body = { message: 'Role é obrigatório para administradores.' };
        return;
      }

      const updatedUser = await editUserAccountUseCase.execute(userId, { name, role });

      ctx.status = 200;
      ctx.body = { message: 'Conta atualizada com sucesso', user: updatedUser };
    } else if (userRole === 'user') {
      const updatedUser = await editUserAccountUseCase.execute(userId, { name, isOnboarded: true });

      ctx.status = 200;
      ctx.body = { message: 'Conta atualizada com sucesso', user: updatedUser };
    } else {
      ctx.status = 403;
      ctx.body = { message: 'Acesso negado. Usuário sem permissões adequadas.' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Erro ao atualizar conta', error: error };
  }
});


router.get('/', authMiddleware, async (ctx) => {
  console.log("ctx", ctx.state.user)
  if (ctx.state.user.role !== 'admin') {
    ctx.status = 403;
    ctx.body = { message: 'Acesso negado. Somente admins podem acessar esta rota.' };
    return;
  }

  try {
    const users = await listAllUsersUseCase.execute();
    ctx.status = 200;
    ctx.body = { users };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Erro ao listar usuários', error };
  }
});

export default router;
