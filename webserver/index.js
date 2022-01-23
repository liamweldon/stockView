const express = require('express');
const _ = require('lodash');
const {exec} = require('child_process');
const {getTrackerValsForSymbol, getSecurity} = require('./database/database');
const {getPriceAndMarketCap} = require('./fmp');
const {PORT, POPULATOR_SCRIPT_LOCATION} = require('./config');

const app = express()

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/trackerVals', async (req, res) => {
    const trackerVals = await getTrackerValsForSymbol(req.query.symbol, req.query.numYears);
    res.send(trackerVals);
})

app.get('/security', async (req, res) => {
    console.log(req.query.symbol);
    let securityData = await getSecurity(req.query.symbol);
    const priceMktCap = await getPriceAndMarketCap(req.query.symbol);
    if (!priceMktCap) {
        res.status(400).end();
        return;
    } else if (!securityData) {
        // TODO: awaiting the promise isn't waiting until the security is populated.
        //       should send a 202, and the client should poll every few seconds.
        const pythonPromise = new Promise((resolve, reject) => {
            exec(`python3 ${POPULATOR_SCRIPT_LOCATION} ${req.query.symbol}`, (err, stdOut, stdErr) => {
                console.log(stdOut);
                console.log(stdErr);
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
        await pythonPromise;
        securityData = await getSecurity(req.query.symbol);
    }
    const rv = _.merge(priceMktCap, securityData);
    console.dir(rv);
    if (rv) {
        res.send(rv);
    } else {
        res.status(400).end();
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})