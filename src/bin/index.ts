#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio'
import express from 'express'
const PORT = 3100
const app = express()
const reqUrl = "https://www.ctmpnumis.fr/en/product-category/gold/"


async function pullData() {
    const response = await axios(reqUrl)
    const html = response.data
    const $ = cheerio.load(html)

    $('.product-small.box', html).each(function () {
        console.log('NEW OFFER:')
        const photo = $(this).find('img').attr('src')
        console.log('PHOTO:', photo)
        const title = $(this).find('a').text()
        console.log('TITLE:', title)
        const rawPrice = $(this).find('.woocommerce-Price-amount').text()
        console.log('RAWPRICE:', rawPrice)
        const truePrice = rawPrice.split(',').join('')
        console.log('TRUEPRICE:', truePrice)
        const price = Number(parseFloat(truePrice))
        console.log('PRICE:', price)
        const currency = $(this).find('.woocommerce-Price-currencySymbol').text()
        console.log('CURRENCY:', currency)
        const link = $(this).find('a').attr('href')
        console.log('LINK:', link)
    })
}

app.listen(PORT, () => console.log(`pusnahme se na port ${PORT}`))

pullData()