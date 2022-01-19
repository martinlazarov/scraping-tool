#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio'
import express from 'express'
const PORT = 3100
const app = express()
const reqUrl = "https://numimarket.pl/index/filters?perpage=2000&sort=desc"

async function pullData() {
    const response = await axios(reqUrl)
    const html = response.data
    const $ = cheerio.load(html)
    $('.offer', html).each(function () {
        console.log("OFFER")
        const photo = $('.image', this).find('img').attr('src')
        console.log(photo)
        const title = $('.title', this).find('a').text()
        console.log(title)
        const price = $('.price', this).find('p').text()
        console.log(price)
        const url = $('.title', this).find('a').attr('href')
        console.log(url)
        
    })
}

app.listen(PORT, () => console.log(`pusnahme se na port ${PORT}`))

pullData()