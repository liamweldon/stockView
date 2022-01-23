import mysql.connector
import sys
from config import dbConfig
from api import callApi

symbol = sys.argv[1]

db = mysql.connector.connect(user=dbConfig["user"], host=dbConfig["host"], database=dbConfig["database"], port=dbConfig["port"], password=dbConfig["password"]);
cursor = db.cursor(dictionary=True)

insertIndustry = ("INSERT INTO Industries "
               "(name) "
               "VALUES (%s)")

industryQuery = ("SELECT industryId FROM Industries WHERE name= %s")


insertSecurity = ("INSERT INTO Securities "
				"(symbol, industryId, name, description) "
				"VALUES (%s, %s, %s, %s)")

securityQuery = ("SELECT securityId FROM Securities WHERE symbol= %s")


insertTrackerMapping = ("INSERT INTO Trackers "
						"(name, mapping, api, biggerBetter) "
						"VALUES (%s, %s, %s, %s)")

apisQuery = ("SELECT api FROM Trackers GROUP BY api")

trackersWithApiQuery = ("SELECT * FROM Trackers WHERE api= %s")

insertTrackerVal = ("INSERT INTO TrackerVals "
							"(trackerId, securityId, date, value) "
							"VALUES (%s, %s, %s, %s)")

getValuesQuery = ("SELECT s.symbol, vals.name, vals.value, vals.date FROM Securities s INNER JOIN"
				  "(SELECT Trackers.name, TrackerVals.securityId, TrackerVals.value, TrackerVals.date"
				  "FROM Trackers INNER JOIN TrackerVals ON Trackers.trackerId = TrackerVals.trackerId)vals"
				  "ON vals.securityId = s.securityId"
				  "ORDER BY s.symbol ASC, vals.date ASC")

def addSecurity(symbol):
	ticker = callApi('profile', symbol)
	industry = ticker[0]["industry"]
	print(industry)
	cursor.execute(industryQuery, [industry])
	industryId = -1
	securityId = -1

	rv = cursor.fetchone()

	if rv == None:
		print('inserting industry...')
		cursor.execute(insertIndustry, [industry])
		industryId = cursor.lastrowid
		db.commit()
	else:
		industryId = rv["industryId"]

	cursor.execute(securityQuery, [symbol])

	rv = cursor.fetchone()

	if rv == None:
		cursor.execute(insertSecurity, [symbol, industryId, ticker[0]["companyName"], None])
		securityId = cursor.lastrowid
		if securityId == None:
			print("Error inserting security %s into db!", symbol)
		db.commit()
	else:
		securityId = rv["securityId"]

def getDataForSymbol(symbol):
	cursor.execute(securityQuery, [symbol])
	securityId = cursor.fetchone()
	cursor.execute(apisQuery)
	apis = cursor.fetchall()
	for api in apis:
		cursor.execute(trackersWithApiQuery, [api['api']])
		trackers = cursor.fetchall()
		data = callApi(api['api'], symbol)
		for filing in data:
			date = filing['date']
			for tracker in trackers:
				val = filing[tracker['mapping']]
				if val != None:
					cursor.execute(insertTrackerVal, [tracker['trackerId'], securityId['securityId'], date, val])
	db.commit()


addSecurity(symbol)
getDataForSymbol(symbol)

cursor.close()
db.close()
