import csv from 'csvtojson'
import path from 'path'

export const exchangeMapping = { ASX: 'XASX', LSE: 'XLSE', ARCA: 'ARCX' }
export const regionMapping = { ASX: 'XASX', LSE: 'gbr', ARCA: 'ARCX' }

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
