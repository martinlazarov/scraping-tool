import express from 'express';
import config from '../config';
import { UserModule } from '../api/user';
import { HomeController } from '../controllers/HomeController';
import jwtAuth from '../api/common/jwtAuth';

const auth = jwtAuth();

const router = express.Router();

export = function (app: express.Express) {

  const homeController = new HomeController();

  app.use('/', router);
  app.get('/', homeController.index);
  app.get('/login', homeController.login);
  app.get('/admin', auth.publicAdminCheck, homeController.adminPanel);
  app.get('/404', homeController.onNotFoundError);

  const User = new UserModule().router().router;
  app.use(config.apiPrefix + '/user', User);

  return router;
}