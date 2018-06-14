import PromisePool from 'es6-promise-pool'

import {
  getJsonTickerList,
  generateURL,
  getTableFromURL,
  cleanUpText
} from './scrapeUtils'
import { prepareDB } from './dbUtils'

const ASYNC_LIMIT = 3
const workToDo = []

function main() {
  prepareDB()
  getJsonTickerList()
    .then(tickerData => {
      tickerData.forEach(row => {
        const scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
        workToDo.push(() => {
          getTableFromURL(scrapeURL, row.tickerSymbol)
        })
      })
    })
    .then(async () => {
      let index = 0
      async function next() {
        if (index < workToDo.length) {
          let myProm = workToDo[index]
          await myProm()
          index++
        }
      }
      // start first iteration
      await next()
    })
}

main()
