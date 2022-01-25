'use strict';
import { environment, apiPrefix } from '../config';
import { MENU, COOKIE_TOKEN_KEY } from '../shared/constants';
import { Request, Response } from 'express';
import { UserRepository } from '../api/user/UserRepository';
import { ScrapeData } from '../api/models/ScrapeData';
import axios from 'axios';
import cheerio from 'cheerio'
import { resolve } from 'path/posix';

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
  private sites = [{
    title: 'Numimarket',
    reqUrls: [
      'https://numimarket.pl/kategoria/monety_21/1',
      'https://numimarket.pl/kategoria/monety_21/2',
      'https://numimarket.pl/kategoria/monety_21/3',
      'https://numimarket.pl/kategoria/monety_21/4'
    ],
    convUrl: 'https://www.x-rates.com/calculator/?from=PLN&to=EUR&amount=1',
    strategy: async (site) => {
      console.log('>>>>', site);
      const baseUrl = 'https://numimarket.pl';
      for (let i = 0; i < site.reqUrls.length; i++) {
        const url = site.reqUrls[i];
        console.log('URL scraped:', url)
        const response = await axios(url);
        const html = response.data
        const $ = cheerio.load(html)

        const response1 = await axios(this.sites[0].convUrl)
        const html1 = response1.data
        const $1 = cheerio.load(html1)
        const rate = $1('.ccOutputRslt', html1).text()

        $('.offers', html).find('.offer').each(function () {
          const photo = $('.image', this).find('img').attr('src')
          const title = $('.title', this).find('a').text()
          const rawPrice = $('.price', this).find('p:first-of-type').text()
          const text = rawPrice.split(' ').join('')
          const priceZl = parseFloat(text);
          const convert = Number(parseFloat(rate).toFixed(2))
          const price = priceZl * convert;
          const currencyZl = text.split(priceZl.toString()).pop()
          const currency = currencyZl.replace('zł', 'EUR')
          const link = $('.image', this).find('a').attr('href');
          userRepository.insertData(new ScrapeData({
            title,
            price,
            currency,
            photo: `${baseUrl}${photo}`,
            link: `${baseUrl}${link}`
          }))
        })
      }
    }
  },
  {
    title: 'MA-Shops',
    reqUrls: [
      'https://www.ma-shops.com/usa/?limit=200&yearstart=1800&gallery=1&ajax=37pd',
      "https://www.ma-shops.com/euro/?limit=200&yearstart=1800&gallery=1&ajax=37pf",
      "https://www.ma-shops.com/world/?limit=200&yearstart=1800&gallery=1&ajax=37pf",
      "https://www.ma-shops.com/european-coins/?limit=200&yearstart=1800&gallery=1&ajax=37pg"
    ],
    strategy: async (site) => {
      for (let i = 0; i < site.reqUrls.length; i++) {
        const url = site.reqUrls[i];
        console.log('URL scraped:', url)
        const response = await axios(url)
        const html = response.data
        const $ = cheerio.load(html)
        $('td', html).each(function () {
          const photo = $('.middle', this).find('img').attr('src')
          const title = $('.middle', this).find('img').attr('title')
          const rawPrice = $('a ~ .price', this).text()
          const txt = rawPrice.split(',').join('.')
          const price = parseFloat(txt);
          const currency = txt.split(price.toFixed(2).toString()).pop()
          const link = $('a', this).attr('href')
          userRepository.insertData(new ScrapeData({
            photo,
            title,
            price,
            currency,
            link
          }));
        })
      }
    }
  }]

  public scrape: any = async (req, res) => {
    try {
      await userRepository.deleteData()
      for (let i = 0; i < this.sites.length; i++) {
        const site = this.sites[i]
        await this.sites[i].strategy(site);
      }
      console.log('Finish');
      res.json(true);
    } catch (error) {
      console.log(error)
    }
  }


  public index: any = async (req: Request, res: Response) => {
    checkLoggedInAndSetActiveMenu(req);

    try {

      const show = await userRepository.getData(req.query)
      res.render('../views/index', { cfg, show: show, searched: req.query });

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