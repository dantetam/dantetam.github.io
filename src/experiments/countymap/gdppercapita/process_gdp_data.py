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

"""
with open("./gdppercapita.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./gdppercapitaProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        for result in results:
            for i in range(len(result)):
                result[i] = result[i].replace("$", "")
                result[i] = result[i].replace('"', "")
                result[i] = result[i].replace(',', "")
            
            writer.writerow(result)
"""        
        
        
        
        
        
        
        
        
# 