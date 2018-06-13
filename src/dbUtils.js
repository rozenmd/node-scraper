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

export function prepareDB(db) {
  db.prepare(CREATE_TABLE_SQL).run()
  return db
}

export function insertRecordIntoDB(db, record) {
  db.prepare(INSERT_INTO_TABLE_SQL).run(record)
  return db
}
