import csv from 'csvtojson'
import path from 'path'
import puppeteer from 'puppeteer'

const exchangeMapping = { ASX: 'XASX', LSE: 'XLSE', ARCA: 'ARCX' }
const regionMapping = { ASX: 'XASX', LSE: 'gbr', ARCA: 'ARCX' }

export async function getHTMLFromURL(url) {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto(url)
  const data = await page.evaluate(() => {
    const TABLE_SELECTOR = '#holding_epage0 tr td'
    const tds = Array.from(document.querySelectorAll(TABLE_SELECTOR))
    return tds.map(td => td.innerHTML)
  })
  return data
}

export function getJsonTickerList() {
  const CSV_FILEPATH = path.join(__dirname, '..', 'data', 'etf_list.csv')
  return csv()
    .fromFile(CSV_FILEPATH)
    .then(tickerList => {
      return tickerList
    })
}

export function generateURL(ticker, exchange) {
  //workaround for LSE-stocks, site appears to be 302ing
  if (exchange === 'LSE') {
    return `http://portfolios.morningstar.com/fund/holdings?t=${ticker}&region=gbr&culture=en-US`
  } else {
    return `https://portfolios.morningstar.com/fund/holdings?t=${
      exchangeMapping[exchange]
    }:${ticker}`
  }
}
