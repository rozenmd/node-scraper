# Node-based Web Scraper

## Setup & Usage

1.  Run `npm install` or `yarn`
2.  Run `npm run dev` or `yarn run dev`

### Design considerations

1.  Using Puppeteer to scrape
1.  Using better-sqlite3 for sqlite3 - solid argument on their [Repo](https://github.com/JoshuaWise/better-sqlite3/blob/master/README.md)
1.  Using csvtojson for transforming CSV to JSON
1.  Decided to use Babel + Webpack for Transpiling to ES2015 for modern JS features
1.  Data is provided to Sqlite3 in unnormalised form for immediate analysis.
1.  Using a function from Stackoverflow to queue/pool up scrape promises

### General algo'

1.  Reads a CSV list of tickers to a JS Object
1.  Generates a URL per ticker in the JS Object
1.  Generates a Promise to visit that URL and adds it to a worker queue
1.  Once the worker queue is fully loaded, we start going through the queue, with N worker promises active at any time.
1.  Each promise visits the page, pulls out some information into an array of JavaScript Objects. At this point we also clean up the data - swapping out dashes for null values.
1.  The queue dumps the results into a JavaScript array (ideally we would add some persistence here so that it would be possible to resume the scrape if it fails)
1.  Once the worker queue is out of promises to work on, the results are iterated through, and dumped into a SQLite3 file in unnormalised form
