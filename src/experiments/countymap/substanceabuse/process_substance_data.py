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

currentLastYear = dict()

with open("./substanceabuse.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    for result in results:
        id = result[0]
        year = int(result[1])
        if id in currentLastYear:
            if currentLastYear[id] < year:
                currentLastYear[id] = year
        else:
            currentLastYear[id] = year
        
with open("./substanceabuse.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./substanceabuseProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        for result in results:
            id = result[0]
            year = int(result[1])
            if currentLastYear[id] != year:
                continue
                
            result[5] = result[5].replace(",", "").replace('"', '') 
            if "-" in result[7]:
                tokens = result[7].split("-")
                result[7] = tokens[0]
                result.append(tokens[1])
            else:
                result[7] = result[7].replace('>', '')
                result.append("Unbounded")
            writer.writerow(result)
        
        
        
        
        
        
        
        
        
# 