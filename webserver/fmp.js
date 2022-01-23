const https = require('https');
const {FMP_KEY, FMP_API_ROOT} = require('./config');


function httpsRequest(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(res) {
            let chunks = '';
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            } else {
                res.on('data', function(chunk) {
                    chunks += chunk;
                });
                res.on('end', function() {
                    return resolve(JSON.parse(chunks))
                })
            }
        }).on('error', (e) => {
            console.error(e);
        });
    });
}


//TODO: this can be moved to the securities populator and stored in mysql
async function getPriceAndMarketCap(symbol) {
    if (symbol) {
        const outlookData = await httpsRequest(`${FMP_API_ROOT}/v4/company-outlook?symbol=${symbol}&apikey=${FMP_KEY}`);
        if (outlookData && outlookData.profile) {
            return {
                price: outlookData.profile.price,
                mktCap: outlookData.profile.mktCap,
                shsOutstanding: outlookData.profile.mktCap / outlookData.profile.price
            }
        }
    }
}

module.exports = {
    getPriceAndMarketCap
}