import PromisePool from 'es6-promise-pool'

import {
  getJsonTickerList,
  generateURL,
  getTableFromURL,
  cleanUpText
} from './scrapeUtils'
import { prepareDB, insertRecordIntoDB } from './dbUtils'

const ASYNC_LIMIT = 3
const promises = []

//Promise queue based on solution here: https://stackoverflow.com/questions/40375551/promise-all-with-limit
function promiseQueue(promiseFactories, limit) {
  let result = []
  let count = 0

  function chain(promiseFactories) {
    if (!promiseFactories.length) return
    let i = count++ // preserve order in result
    let task = promiseFactories.shift()
    return task().then(data => {
      if (data && data.length > 0) {
        result[i] = data
      }
      return chain(promiseFactories) // append next promise
    })
  }
  let arrChains = []
  while (limit-- > 0 && promiseFactories.length > 0) {
    // create `limit` chains which run in parallel
    arrChains.push(chain(promiseFactories))
  }
  // return when all arrChains are finished
  return Promise.all(arrChains).then(() => result)
} //END Stackoverflow code

function main() {
  prepareDB()
  getJsonTickerList()
    .then(tickerData => {
      const tickerCount = tickerData.length
      tickerData.forEach((row, index) => {
        const scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
        promises.push(() => {
          console.log(
            `Scraping ${row.tickerSymbol}, ${index}/${tickerCount} scraped`
          )
          return getTableFromURL(scrapeURL, row.tickerSymbol)
        })
      })
    })
    .then(() => {
      promiseQueue(promises, ASYNC_LIMIT).then(result => {
        result.forEach(ticker => {
          if (ticker) insertRecordIntoDB(ticker)
        })
      })
    })
}

main()
