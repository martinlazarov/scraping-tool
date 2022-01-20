#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio'
import express from 'express'
const PORT = 3100
const app = express()
const reqUrl = "https://www.ma-shops.com/euro/?limit=200&yearstart=1800&gallery=1&ajax=37pf"

async function pullData() {
    const response = await axios(reqUrl)
    const html = response.data
    const $ = cheerio.load(html)
    $('td', html).each(function () {
        console.log("OFFER")
        const photo = $('.middle', this).find('img').attr('src')
        const title = $('.middle', this).find('img').attr('title')
        const raw = $('a ~ .price', this).text()
        const txt = raw.split(',').join('.')
        const price = parseFloat(txt).toFixed(2);
        console.log(price)
        const currency = txt.split(price.toString()).pop()
        console.log(currency)
        const link = $('a', this).attr('href')
    })
}

app.listen(PORT, () => console.log(`pusnahme se na port ${PORT}`))

pullData()