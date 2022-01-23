const mysql = require('mysql');
const moment = require('moment');
const {MYSQL_CONFIG} = require('../config');

const connection = mysql.createConnection(MYSQL_CONFIG);

const makeQueryPromise = (query) => {
	return new Promise((resolve, reject) => {
		connection.query(query, (err, vals) => {
			if (err) {
				reject(err);
			} else {
				resolve(vals);
			}
		})
	})
}

module.exports = {
	getTrackerValsForSymbol : async (symbol, numYears = 10) => {
		const today = moment().format('YYYY-MM-DD');
		const startDate = moment().subtract(numYears, 'years').format('YYYY-MM-DD');
		const query = `SELECT s.symbol, vals.name, vals.value, vals.date FROM Securities s INNER JOIN 
				  (SELECT Trackers.name, TrackerVals.securityId, TrackerVals.value, TrackerVals.date
				  FROM Trackers INNER JOIN TrackerVals ON Trackers.trackerId = TrackerVals.trackerId)vals
				  ON vals.securityId = s.securityId
				  WHERE s.symbol='${symbol}'
				  AND vals.date BETWEEN '${startDate}' AND '${today}'
				  ORDER BY vals.name ASC, vals.date ASC`;




		const queryPromise = new Promise((resolve, reject) => {
			connection.query(query, (err, vals) => {
				if (err) {
					reject(err);
				} else {
					resolve(vals);
				}
			})
		})
		const vals = await queryPromise;
		return vals;
	},
	getSecurity : async(symbol) => {
		const query = `SELECT s.securityId, s.symbol, s.name, i.name AS industryName from Securities s INNER JOIN
 						Industries i ON s.industryId = i.industryId WHERE symbol='${symbol}';`
		const queryPromise = makeQueryPromise(query);
		const result = await queryPromise;
		if (result[0]) {
			return JSON.parse(JSON.stringify(result[0]));
		}
	}
}

