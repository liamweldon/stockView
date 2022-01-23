import mysql.connector
import sys
from trackers import trackersList
from config import dbConfig

db = mysql.connector.connect(user=dbConfig["user"], host=dbConfig["host"], database=dbConfig["database"], port=dbConfig["port"], password=dbConfig["password"]);
cursor = db.cursor(dictionary=True)

trackerQuery = ("SELECT trackerId FROM Trackers WHERE name= %s")

insertTrackerMapping = ("INSERT INTO Trackers "
						"(name, mapping, api, biggerBetter) "
						"VALUES (%s, %s, %s, %s)")

def addTracker(tracker):
	cursor.execute(trackerQuery, [tracker["name"]])
	
	foundVal = cursor.fetchone()

	if foundVal is not None:
		print(tracker["name"] + ' already exists in db, continuing...')
		return

	if tracker["mapping"] != None:
		cursor.execute(insertTrackerMapping, [tracker["name"], tracker["mapping"], tracker["api"], tracker["bb"]])
		trackerId = cursor.lastrowid
		if trackerId == None:
			print("Error inserting tracker %s into db!", tracker["name"])
		db.commit()

if len(sys.argv) > 1:
	if sys.argv[1] == '--help' or sys.argv[1] == '-h':
		print('Usage: python3 trackerPopulator.py trackerName trackerApiMapping api biggerBetter')
	else:
		tracker = {
			"name": sys.argv[1],
			"mapping": sys.argv[2],
			"api": sys.argv[3],
			"bb": eval(sys.argv[4])
		}
		addTracker(tracker)
else:
	for tracker in trackersList:
		addTracker(tracker)