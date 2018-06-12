import { getJsonTickerList, generateURL, getHTMLFromURL } from './utils'

function main() {
  // getJsonTickerList().then(tickerData => {
  //   tickerData.forEach(row => {
  //     let scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
  //     console.log(scrapeURL)
  //   })
  // })
  getHTMLFromURL(
    'http://portfolios.morningstar.com/fund/holdings?t=LTMU&region=gbr&culture=en-US'
  )
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}

main()
