import {
  getJsonTickerList,
  generateURL,
  getTableFromURL,
  reformatData
} from './utils'

function main() {
  // getJsonTickerList().then(tickerData => {
  //   tickerData.forEach(row => {
  //     let scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
  //     console.log(scrapeURL)
  //   })
  // })
  getTableFromURL(
    // 'http://portfolios.morningstar.com/fund/holdings?t=LTMU&region=gbr&culture=en-US'
    'http://portfolios.morningstar.com/fund/holdings?t=XASX:STW'
  )
    .then(data => {
      console.log('pre-format length: ', data.length)
      let temp = reformatData(data)
      console.log('post-format length: ', temp.length)
    })
    .catch(err => {
      console.log(err)
    })
}

main()
