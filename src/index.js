import {
  getJsonTickerList,
  generateURL,
  getTableFromURL,
  cleanUpText
} from './scrapeUtils'
import { prepareDB, insertRecordIntoDB } from './dbUtils'
import Database from 'better-sqlite3'

function main() {
  const db = new Database('scrape-results.db')
  //passing around the db to keep it testable - no need to mock a DB in tests
  prepareDB(db)

  getJsonTickerList().then(tickerData => {
    tickerData.forEach(row => {
      const scrapeURL = generateURL(row.tickerSymbol, row.exchangeSymbol)
      console.log('now scraping: ', scrapeURL)
      return getTableFromURL(scrapeURL, row.tickerSymbol)
        .then(data => {
          insertRecordIntoDB(db, data)
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
  db.close()
}

main()
