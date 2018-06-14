import csv from 'csvtojson'
import path from 'path'
import puppeteer from 'puppeteer'

const exchangeMapping = { ASX: 'XASX', LSE: 'XLSE', ARCA: 'ARCX' }
const CSV_FILEPATH = path.join(__dirname, '..', 'data', 'etf_list.csv')

export async function getTableFromURL(url, etfTicker) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: true
      })
      const page = await browser.newPage()
      await page.goto(url)

      //sort of an annoyingly untestable function to get a URL, parse its html and return data
      const data = await page.evaluate(etfTicker => {
        //helper function to avoid having to re-traverse the output
        function cleanUpText(string) {
          //this dash here👇 is actually not the standard dash
          if (string === '—') return null
          return string
        }
        //get the list of table rows
        let trs
        const output = []
        //trying to find bond table rows
        trs = Array.from(
          document.querySelectorAll('table tbody#holding_bpage0 tr:not(.hr)')
        )
        if (trs) {
          trs.forEach(tr => {
            //get all tds and ths of this row
            let temp = {}
            let row = tr.querySelectorAll('td,th')
            temp.companyName = cleanUpText(row[1].innerText)
            temp.percentPortfolioWeight = cleanUpText(row[4].innerText)
            temp.sharesOwned = cleanUpText(row[5].innerText)
            temp.sector = null
            temp.style = null
            temp.firstBought = null
            temp.companyTicker = null
            temp.country = null
            temp.ytdReturn = null
            temp.etfTicker = etfTicker
            temp.etfType = 'BOND'
            output.push(temp)
          })
        } //couldnt find the bond table rows - trying equities
        else {
          trs = Array.from(
            document.querySelectorAll('table tbody#holding_epage0 tr:not(.hr)')
          )
          trs.forEach(tr => {
            //get all tds and ths of this row
            let temp = {}
            let row = tr.querySelectorAll('td,th')
            temp.companyName = cleanUpText(row[1].innerText)
            temp.percentPortfolioWeight = cleanUpText(row[4].innerText)
            temp.sharesOwned = cleanUpText(row[5].innerText)
            temp.sector = row[7].querySelector('span')
              ? cleanUpText(row[7].querySelector('span').title)
              : null
            temp.style = row[8].querySelector('span')
              ? cleanUpText(row[8].querySelector('span').className)
              : null
            temp.firstBought = cleanUpText(row[10].innerText)
            temp.companyTicker = row[11].querySelector('a')
              ? cleanUpText(row[11].querySelector('a').href.split('t=')[1])
              : null
            temp.country = cleanUpText(row[12].innerText)
            temp.ytdReturn = cleanUpText(row[13].innerText)
            temp.etfTicker = etfTicker
            temp.etfType = 'EQUITY'
            output.push(temp)
          })
        }

        return output
      }, etfTicker)
      browser.close()

      return resolve(data)
    } catch (err) {
      console.error(`Error on ${url}`, err)
      return reject(err)
    }
  })
}

export function getJsonTickerList() {
  return csv()
    .fromFile(CSV_FILEPATH)
    .then(tickerList => {
      return tickerList
    })
}

export function generateURL(ticker, exchange) {
  if (exchange === 'ASX') {
    return `https://portfolios.morningstar.com/fund/holdings?t=${
      exchangeMapping[exchange]
    }:${ticker}`
  } else {
    return `http://portfolios.morningstar.com/fund/holdings?t=${ticker}`
  }
}
