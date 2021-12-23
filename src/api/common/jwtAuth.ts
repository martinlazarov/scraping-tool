import * as express from "express";
import * as mysql from '../../lib/mysqlConnection/MysqlConnection';
import * as jwt from 'jwt-simple';
import url from 'url';
import config from '../../config';
import { COOKIE_TOKEN_KEY } from '../../shared/constants';
import { AuthError } from "../../errors/AuthError";
import { UserRepository } from "../user/UserRepository";
import { User } from '../models/User';
import { Roles } from '../../shared/enums/roles.enum';

const URepository = new UserRepository(mysql);

export = function Auth(): any {

  async function checkUser(
      accessLevel: Roles,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
      isApiCall: boolean
    ) {
    const parsed_url = url.parse(req.url, true);
    
    const token = req.body.access_token || parsed_url.query.access_token 
      || req.headers['x-access-token'] || req.cookies[COOKIE_TOKEN_KEY];

    if (token) {
      try {
        const secret = config.jwtSecret;
        const decoded = jwt.decode(token, secret);
        const user: User = await URepository.findUser(decoded.iss);

        if (!user) {
          return next(new AuthError("Несъществуващ потребител"));

        } else {
          if (accessLevel === Roles.Admin && user.role !== Roles.Admin) {
            return isApiCall ? next(new AuthError("Достъп само за Администратори")) : next();
          }

          req.user = user;
          return next();
        }
      } catch (err) {
        next(new AuthError(err.toString()));
      }
    } else {
      return isApiCall ? next(new AuthError("Липсва Access Token")) : next();
    }
  }

  function userCheck(req: express.Request, res: express.Response, next: express.NextFunction) {
    void checkUser(Roles.User, req, res, next, true); 
  }

  function adminCheck(req: express.Request, res: express.Response, next: express.NextFunction) {
    void checkUser(Roles.Admin, req, res, next, true); 
  }

  function publicAdminCheck(req: express.Request, res: express.Response, next: express.NextFunction) {
    void checkUser(Roles.Admin, req, res, next, false); 
  }

  return {
    userCheck,
    adminCheck,
    publicAdminCheck
  };
};
