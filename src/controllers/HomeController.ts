'use strict';
import { environment, apiPrefix } from '../config';
import { MENU, COOKIE_TOKEN_KEY } from '../shared/constants';
import { Request, Response } from 'express';
import { UserController } from '../api/user/UserController';
import { UserRepository } from '../api/user/UserRepository';
import { ScrapeData } from '../api/models/ScrapeData';
import axios from 'axios';
import cheerio from 'cheerio'

// necessary config file used in all templates
const cfg = {
  environment,
  apiPrefix
};

const mysql = require('../lib/mysqlConnection/MysqlConnection')
const userRepository = new UserRepository(mysql)

// processActiveMenu switch is used for pages (like 404) that cannot be made active, since
// they are not part of the menu (there is no menu item to me made active)
const checkLoggedInAndSetActiveMenu = (req: Request, processActiveMenu = true): void => {
  cfg['loggedIn'] = !!req.cookies[COOKIE_TOKEN_KEY];

  const requestUrl = processActiveMenu ? req.url.split('?')[0] : '';

  cfg['MENU'] = MENU.map(item => {
    if (cfg['loggedIn'] && item.url === '/login') return false;

    item['active'] = item.url === requestUrl ? true : false;
    return item;

  }).filter(item => item);
};


export class HomeController {
  

  public scrape: any = async () => {

    try {

      await userRepository.deleteData()
      const sites = [{
        title: 'Numimarket',
        reqUrls: ['https://numimarket.pl/kategoria/monety_21/1',
          'https://numimarket.pl/kategoria/monety_21/2',
          'https://numimarket.pl/kategoria/monety_21/3',
          'https://numimarket.pl/kategoria/monety_21/4'
        ],
        strategy: async () => {
          for (let i = 0; i < sites[1].reqUrls.length; i++) {
            const response = await axios(sites[0].reqUrls[i])
            const html = response.data
            const $ = cheerio.load(html)
            let scraped = [];
            let data;
            let dataArr = []
            $('.offers', html).find('.offer').each(function () {
              const photo = $('.image', this).find('img').attr('src')
              const title = $('.title', this).find('a').text()
              const rawPrice = $('.price', this).find('p:first-of-type').text()
              const text = rawPrice.split(' ').join('')
              const price = parseFloat(text);
              const currency = text.split(price.toString()).pop()
              const link = $('.image', this).find('a').attr('href')
              data = {
                photo: 'https://numimarket.pl' + photo,
                title: title,
                price: price,
                currency: currency,
                link: 'https://numimarket.pl' + link
              }
              dataArr.push(data)
            })
            dataArr.forEach(function (element) {
              scraped.push(new ScrapeData(element))
            })
            scraped.forEach(async (element) => {
              await userRepository.insertData(element)
            })
          }
        }
      },
      {
        title: 'MA-Shops',
        reqUrls: ['https://www.ma-shops.com/usa/?limit=200&yearstart=1800&gallery=1&ajax=37pd',
          "https://www.ma-shops.com/euro/?limit=200&yearstart=1800&gallery=1&ajax=37pf",
          "https://www.ma-shops.com/world/?limit=200&yearstart=1800&gallery=1&ajax=37pf",
          "https://www.ma-shops.com/european-coins/?limit=200&yearstart=1800&gallery=1&ajax=37pg"
        ],
        strategy: async () => {
          for (let i = 0; i < sites[1].reqUrls.length; i++) {
            const response = await axios(sites[1].reqUrls[i])
            const html = response.data
            const $ = cheerio.load(html)
            let scraped = [];
            let data;
            let dataArr = []
            $('td', html).each(function () {
              const photo = $('.middle', this).find('img').attr('src')
              const title = $('.middle', this).find('img').attr('title')
              const rawPrice = $('a ~ .price', this).text()
              const txt = rawPrice.split(',').join('.')
              const price = parseFloat(txt).toFixed(2);
              const currency = txt.split(price.toString()).pop()
              const link = $('a', this).attr('href')
              data = {
                photo: photo,
                title: title,
                price: price,
                currency: currency,
                link: link
              }
              dataArr.push(data)
            })
            dataArr.forEach(function (element) {
              scraped.push(new ScrapeData(element))
            })
            scraped.forEach(async (element) => {
              await userRepository.insertData(element)
            })
          }
        }
      }]
      for (let i = 0; i < sites.length; i++) {
        await sites[i].strategy()
      }
    } catch (error) {
      console.log(error)
    }
  }


  public index: any = async (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req);

    try {

      const show = await userRepository.getData(req.query)
      res.render('../views/index', { cfg, show: show });

    } catch (error) {
      console.log(error);
      this.onNotFoundError(req, res);
    }
  };

  public login: any = (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req);

    try {
      res.render('../views/login', { cfg });
    } catch (error) {
      console.log(error);
      this.onNotFoundError(req, res);
    }
  };

  public adminPanel: any = (req: Request, res: Response) => {
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