import {
  getJsonTickerList,
  generateURL,
  getTableFromURL,
  cleanUpText
} from './utils'

function main() {
  // getJsonTickerList().then(tickerData => {
  //   tickerData.forEach(row => {
  //     let scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
  //     console.log(scrapeURL)
  //   })
  // })
  getTableFromURL(
    'http://portfolios.morningstar.com/fund/holdings?t=LTMU'
    // 'http://portfolios.morningstar.com/fund/holdings?t=XASX:STW'
  )
    .then(data => {
      console.log('ready to go data: ', data)
    })
    .catch(err => {
      console.log(err)
    })
}

main()
