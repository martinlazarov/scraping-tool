#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio'
import express from 'express'
const PORT = 3100
const app = express()
const reqUrl = "https://antika.fr/catalog2/index.php?route=product/category&path=10011_40047"


async function pullData() {
    const response = await axios(reqUrl)
    const html = response.data
    const $ = cheerio.load(html)

    $('.product-thumb', html).each(function () {
        const photo = $('.image', this).find('img').attr('src')
        console.log('PHOTO:', photo)
        const title = $('h4', this).find('a').text()
        console.log('TITLE:', title)
        const rawPrice = $('.price', this).text()
        const text = rawPrice.split(',').join('')
        const price = Number(parseFloat(text))
        console.log('PRICE:', price)
        const currency = text.split(price.toFixed(2)).pop()
        console.log('CURRENCY:', currency)
        const link = $('h4', this).find('a').attr('href');
        console.log('LINK:', link)
    })
}

app.listen(PORT, () => console.log(`pusnahme se na port ${PORT}`))

pullData()