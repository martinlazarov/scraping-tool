'use strict';
import { environment, apiPrefix } from '../config';
import { MENU, COOKIE_TOKEN_KEY } from '../shared/constants';
import { Request, Response } from 'express';

// necessary config file used in all templates
const cfg = {
  environment,
  apiPrefix
};

// processActiveMenu switch is used for pages (like 404) that cannot be made active, since
// they are not part of the menu (there is no menu item to me made active)
const checkLoggedInAndSetActiveMenu = (req: Request, processActiveMenu = true): void => {
  cfg['loggedIn'] = !!req.cookies[COOKIE_TOKEN_KEY];

  const requestUrl = processActiveMenu ? req.url.split('?')[0] : '';

  cfg['MENU'] = MENU.map(item => {
    if (cfg['loggedIn'] && item.url === '/login') return false;

    item['active'] = item.url === requestUrl ?  true : false;
    return item;

  }).filter(item => item);
};


export class HomeController {

  public index:any = (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req);

    try {
      res.render('../views/index', { cfg });
    } catch (error) {
      console.log(error);
      this.onNotFoundError(req, res);
    }
  };

  public login:any = (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req);
    
    try {
      res.render('../views/login', { cfg });
    } catch (error) {
      console.log(error);
      this.onNotFoundError(req, res);
    }
  };

  public adminPanel:any = (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req, false);

    const user = req['user'];
    if (!user) {
      return res.redirect('/');
    }
    try {
      res.render('../views/admin', { cfg, user });
    } catch (error) {
      console.log(error);
      this.onNotFoundError(req, res);
    }
  };

  public onNotFoundError: any = (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req, false);
    res.render('../views/404', { cfg });
  };

}