import * as mysql from '../../lib/mysqlConnection/MysqlConnection';

import { UserRepository } from './UserRepository';
import { UserController } from './UserController';
import { UserRouter } from './UserRouter';

export class UserModule {

  public router(): any {

    const Repository = new UserRepository(mysql);
    const Controller = new UserController(Repository);
    const router = new UserRouter(Controller);
    return router;
    
  }
}