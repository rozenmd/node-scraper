import { getJsonTickerList, generateURL } from './utils'

function main() {
  getJsonTickerList().then(tickerData => {
    tickerData.forEach(row => {
      let scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
      console.log(scrapeURL)
    })
  })
}

main()
