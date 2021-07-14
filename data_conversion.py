import csv
import json

steamCSVPath = 'resources/steam-200k.csv'
steamjsonFilePath = 'resources/steam_data.json'

steamData = {}
with open(steamCSVPath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        id = rows['UserId']
        steamData[id] = rows

with open(steamjsonFilePath, 'w') as jsonFile:
    jsonFile.write(json.dumps(steamData, indent=4))

mergedCSVPath = 'resources/steam_sales_data.csv'
mergedjsonFilePath = 'resources/merged.json'

mergedData = {}
with open(mergedCSVPath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        id = rows['Index']
        mergedData[id] = rows

with open(mergedjsonFilePath, 'w') as jsonFile:
    jsonFile.write(json.dumps(mergedData, indent=4))

vgsalesCSVPath = 'resources/vgsales-12-4-2019-short.csv'
vgsalesjsonFilePath = 'resources/vg_sales_data.json'

vgsalesData = {}
with open(vgsalesCSVPath, encoding="utf8") as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        id = rows['Rank']
        vgsalesData[id] = rows

with open(vgsalesjsonFilePath, 'w') as jsonFile:
    jsonFile.write(json.dumps(vgsalesData, indent=4))