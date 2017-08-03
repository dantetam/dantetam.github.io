import csv
import operator

import urllib
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

stateAbbrs = dict()
        
with open("./crime_data.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./crimeDataProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        header.insert(1, "CountyId")
        writer.writerow(header)
        for result in results:
            countyIdStr = int(result[22]) * 1000 + int(result[23])
            countyIdStr = str(countyIdStr)
            result.insert(1, countyIdStr.zfill(5))
            
            writer.writerow(result)   
        
        
        
        
        
        
        
        
# 