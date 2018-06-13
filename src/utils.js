import csv from 'csvtojson'
import path from 'path'
import puppeteer from 'puppeteer'

const exchangeMapping = { ASX: 'XASX', LSE: 'XLSE', ARCA: 'ARCX' }
const regionMapping = { ASX: 'XASX', LSE: 'gbr', ARCA: 'ARCX' }

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
    // return document.querySelectorAll('tbody#holding_epage0').innerHTML
    return trs.map(tr => tr.innerHTML)
  })
  return data
}

export function reformatData(data) {
  return data
  // console.log('data: ', data)
  // const finalData = []
  // data.forEach(row => {
  //   const [
  //     nullVar,
  //     companyName,
  //     percentPortfolioWeight,
  //     sharesOwned,
  //     sector,
  //     style,
  //     firstBought,
  //     country,
  //     ytdReturn
  //   ] = row
  //   finalData.push({
  //     ticker: '',
  //     companyName: companyName,
  //     percentPortfolioWeight: percentPortfolioWeight,
  //     sharesOwned: sharesOwned,
  //     sector: sector,
  //     style: style,
  //     firstBought: firstBought,
  //     country: country,
  //     ytdReturn: ytdReturn
  //   })
  // })
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
