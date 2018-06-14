# Node-based Web Scraper

### Usage

TODO: Write this section!

### Design considerations

1.  Using Puppeteer to scrape
1.  Using better-sqlite3 for sqlite3 - solid argument on their [Repo](https://github.com/JoshuaWise/better-sqlite3/blob/master/README.md)
1.  Using csvtojson for transforming CSV to JSON
1.  Decided to use Babel + Webpack for Transpiling to ES2015 for modern JS features
1.  Data is provided to Sqlite3 in unnormalised form for immediate analysis.
1.  Using the 'async' module to queue up scrapes - rather than firing all 3k at once
