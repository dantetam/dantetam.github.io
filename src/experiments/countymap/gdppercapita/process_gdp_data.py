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

stateAbbrs = dict()

#Add state abbrs
with open("stateAbbrs.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)
    for result in results:
        result[0] = result[0].replace('"', "")
        result[1] = result[1].replace('"', "")
        stateAbbrs[result[0]] = result[1]
        
with open("./gdppercapita.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./gdppercapitaProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        for result in results:
            if (result[2] == "State" or result[2] == "Country"): 
                continue
            for i in range(len(result)):
                result[i] = result[i].replace("$", "")
                result[i] = result[i].replace('"', "")
                result[i] = result[i].replace(',', "")
            result.insert(3, stateAbbrs[result[2]])
            
            writer.writerow(result)   
        
        
        
        
        
        
        
        
# 