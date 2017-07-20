import csv
import operator

"""
with open("./Top5000Population.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./Top5000PopulationProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        for result in results:
            result[2] = result[2].replace(",", "").replace('"', '')
            writer.writerow(result)
"""

import urllib
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

rowNum = 0

with open("./Middle2500.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./Middle2500PopulationProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        for result in results:
            result[2] = result[2].replace(",", "").replace('"', '')

            placeString = result[0] + "," + result[1]
            placeString = placeString.replace(" ", "_");
            url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + placeString + '&key=AIzaSyAP21EsKqlukt2dZGb766My2UwCAHTbD1U'

            data = urllib.request.urlopen(url).read().decode() 
            parsed_json = json.loads(data)

            location = parsed_json["results"][0]["geometry"]["location"]
            print(location["lat"], location["lng"])
        
            result.append(location["lat"])
            result.append(location["lng"])
            
            writer.writerow(result)
            
            rowNum = rowNum + 1
            
            if rowNum >= 2000:
                break
            
            
        
        
        
        
        
        
        
        
        
# 