import * as express from "express";
import moment from "moment";
import * as jwt from 'jwt-simple';
import config from '../../config';
import { INACTIVE_ACCOUNT_MESSAGE } from "../../shared/constants";
import { AuthError } from "../../errors/AuthError";
import { LoginData } from "../models/LoginData";
import { User } from "../models/User";
import { UserRepository } from "./UserRepository";
import { DatabaseError } from "../../errors/DatabaseError";
import { NotFoundError } from '../../errors/NotFoundError';
import { Utils } from "../common/Utils";

export class UserController {

  repository: UserRepository;

  constructor(Repository: UserRepository) {
    this.repository = Repository;
  }

  public register: any = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
      const user = new User(req.body);
      console.log(`Register initiated by ${user.email}`);

      if (!Utils.validateEmail(user.email)) {
        return next(new AuthError("Грешен формат на имейл адреса"));
      }

      const existing = await this.repository.findUserIdByEmail(user.email);

      if (existing) {
        return next(new AuthError("Потребител с този имейл вече съществува"));
      }

      user.id = await this.repository.registerUser(user, req.body.password);

      res.json({ userId: user.id });

    } catch (error) {
      console.log(error);
      next(new DatabaseError("Грешка в базата данни при регистрация на нов потребител!"));
    }
  }

  public login: any = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = await this.repository.loginUser(new LoginData(req.body));

      if (!user) {
        return next(new NotFoundError("Грешен или несъществуващ потребител"));
      }
      if (user.isActive !== 1) {
        return next(new AuthError(INACTIVE_ACCOUNT_MESSAGE));
      }
      console.log(`Login initiated by: ${user.email}`);

      this._setLoggedUserDataAndToken(user, res);
    } catch (error) {
      console.log(error);
      next(new DatabaseError("Възникна проблем в системата по време на логин!"));
    }
  }

  _setLoggedUserDataAndToken: any = (user: User, res: express.Response) => {
    const expires = moment().add(7, 'days').valueOf();
    const token = jwt.encode(
      {
        iss: user.id,
        exp: expires
      },
      config.jwtSecret
    );
    res.json({ user, token });
  }

  public getMe: any = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = new User(req.user);

      if (!user.id) return res.status(400).send('Dai User');

      const data = await this.repository.findUser(user.id);

      res.status(200).json({ data });

    } catch (error) {
      console.log(error);
      next(new DatabaseError("Грешка в базата данни при регистрация на нов потребител!"));
    }
  }

}