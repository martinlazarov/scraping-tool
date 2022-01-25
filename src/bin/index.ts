#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio'
import express from 'express'
const PORT = 3100
const app = express()
const reqUrl = "https://numimarket.pl/kategoria/monety_21/1"
const convUrl = 'https://www.x-rates.com/calculator/?from=PLN&to=EUR&amount=1'

async function pullData() {
    const response = await axios(reqUrl)
    const html = response.data
    const $ = cheerio.load(html)
    const response1 = await axios(convUrl)
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
        console.log(price)
        const currencyZl = text.split(priceZl.toString()).pop()
        const currency = currencyZl.replace('zł', 'EUR')
        console.log(currency)
        const link = $('.image', this).find('a').attr('href');
    })
}

async function pullConv() {
    const response1 = await axios(convUrl)
    const html1 = response1.data
    const $1 = cheerio.load(html1)
    const rate = $1('.ccOutputRslt', html1).text()
    const convert = parseFloat(rate)
}

app.listen(PORT, () => console.log(`pusnahme se na port ${PORT}`))

pullData()