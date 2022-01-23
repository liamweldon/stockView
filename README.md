# stockView

React + Express app to view stock fundamentals data across several years in an easy to compare format.

[Data provided by Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs). 
To use the app, an account is required. The API Key for the account must be copied to dbPopulator/config.py and webserver/config.js

## Setup

### MySQL
 - Install MySQL. [MySQL workbench](https://dev.mysql.com/downloads/workbench/) is very useful for visualizing data/running quick sample queries
 - Run `mysql -h <hostname> -u <user> < stockview_setup.sql` to setup all tables needed for stockview database.
 - Copy config values for MySQL in dbPopulator/config.py and webserver/config.js
 - Add path to dbPopulator/securitiesPopulator.py to webserver/config.js

### WebServer
 - Run `npm install` from webserver parent directory to install necessary dependencies.
 - After installation, run `node index.js` to start the server.

### WebClient
 - Run `npm install` from webclient parent directory to install necessary dependencies.
 - After installation, run `npm start` to start the client. 


## TODO

- [ ] Watchlists for grouping together securities
- [ ] Conditional formatting across Industries
- [ ] Conditional formatting across Watchlists