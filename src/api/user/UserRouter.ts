import { BaseRouter } from '../../BaseRouter';
import { UserController } from './UserController';
import jwtAuth from '../common/jwtAuth';
const auth = jwtAuth();

export class UserRouter extends BaseRouter {
  private controller: UserController;

  constructor(controller: UserController) {
    super();
    this.controller = controller;
    this.buildRoutes();
  }

  private buildRoutes() {
    this.router.get('/', this.controller.filter)
    this.router.post('/register', this.controller.register);
    this.router.post('/login', this.controller.login);
    this.router.get('/me', auth.userCheck, this.controller.getMe);
  }
}
