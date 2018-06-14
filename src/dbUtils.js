import Database from 'better-sqlite3'

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS results (
company_name TEXT,
percent_portfolio_weight TEXT,
shares_owned TEXT,
sector TEXT,
style TEXT,
first_bought TEXT,
company_ticker TEXT,
country TEXT,
ytd_return TEXT,
etf_ticker TEXT
)`

const INSERT_INTO_TABLE_SQL = `INSERT INTO results (
  company_name,
  percent_portfolio_weight,
  shares_owned,
  sector,
  style,
  first_bought,
  company_ticker,
  country,
  ytd_return,
  etf_ticker
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

export function prepareDB() {
  let db = new Database('scrape-results.db')
  db.prepare(CREATE_TABLE_SQL).run()
  db.close()
}

export function insertRecordIntoDB(record) {
  let db = new Database('scrape-results.db')
  console.log('preparing to insert: ', record)
  db.prepare(INSERT_INTO_TABLE_SQL).run(record)
  db.close()
}
