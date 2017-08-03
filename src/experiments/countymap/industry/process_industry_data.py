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

allData = {}
dataIndices = [3,15,27,39,51,63,75,87,99,111,123,135,147,159]

with open('./ACS_15_5YR_S2405.csv', 'r+') as f:
    """
    for row in csv.reader(f, delimiter=',', skipinitialspace=True):
        if rowNum == 0:
            formatted = {i: row[i] for i in range(len(row))}
            #for k,v in formatted.items():
                #print(k,v)
        rows.append(','.join(row))
        rowNum = rowNum + 1
    """
    header = next(f).strip("\n").split(",")
    reader = csv.reader(f)
    results = filter(lambda row: True, reader)
    
    for row in results:
        id = row[1]
        if id not in allData:
            allData[id] = [id]
        for index in dataIndices:
            allData[id].append(row[index])
        
        allData[id] = [ '%.3f' % ( float(allData[id][i]) / float(allData[id][1]) * 100.0 ) if i >= 2 else allData[id][i] for i in range(len(allData[id])) ]
        #print(allData[id])
    
header = ["CountyId", "Total", 
    "NaturalResources", "Construction", "Manufacturing", "WholesaleTrade", "RetailTrade", 
    "TransportationUtilities", "Information", "Finance", "ProfessionalScientific", "Education", 
    "ArtsEntertainment", "OtherServices", "Administration"]
    
with open("./industryPercentageProcessed.csv", 'w+') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(header)
    for k,v in allData.items():
        writer.writerow(v)
    
"""    
        
with open("./substanceabuse.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)

    with open("./substanceabuseProcessed.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        for result in results:
            writer.writerow(result)
"""
        
        
        
        
        
        
        
        
        
        
        
# 