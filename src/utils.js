import csv from 'csvtojson'
import path from 'path'
import puppeteer from 'puppeteer'

const exchangeMapping = { ASX: 'XASX', LSE: 'XLSE', ARCA: 'ARCX' }

export async function getTableFromURL(url) {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto(url)
  console.log(url)

  const data = await page.evaluate(() => {
    //list of table rows
    const trs = Array.from(
      document.querySelectorAll('#holding_epage0 tr:not(.hr)')
    )
    const output = []
    trs.forEach(tr => {
      //get all tds and ths of this row
      let temp = {}
      let row = tr.querySelectorAll('td,th')
      temp.companyName = row[1].innerText
      temp.percentPortfolioWeight = row[4].innerText
      temp.sharesOwned = row[5].innerText
      temp.sector = row[7].querySelector('span')
        ? row[7].querySelector('span').title
        : null
      temp.style = row[8].querySelector('span')
        ? row[8].querySelector('span').className
        : null
      temp.firstBought = row[10].innerText
      temp.companyTicker = row[11].querySelector('a')
        ? row[11].querySelector('a').href.split('t=')[1]
        : null
      temp.country = row[12].innerText
      temp.ytdReturn = row[13].innerText
      output.push(temp)
    })
    return output
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
  if (exchange === 'ASX') {
    return `https://portfolios.morningstar.com/fund/holdings?t=${
      exchangeMapping[exchange]
    }:${ticker}`
  } else {
    return `http://portfolios.morningstar.com/fund/holdings?t=${ticker}`
  }
}
