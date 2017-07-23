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

states = []

countyNamesPerState = dict()


def countyNameMatch(testName, stateAbbr):
    testNameProcessed = testName.replace('"', "").replace("County", "").replace("Borough", "").replace("Parish", "").replace("Municipality", "").replace("City", "").replace("city", "").strip()

    dictCountyNames = countyNamesPerState[stateAbbr]
    for countyName, countyId in dictCountyNames.items():
        countyNameProcessed = countyName.replace('"', "").replace("County", "").replace("Borough", "").replace("Parish", "").replace("Municipality", "").replace("City", "").replace("city", "").strip()
        if testNameProcessed == countyNameProcessed:
            return countyName, countyId
        if testName.split(" ")[0] == countyNameProcessed.split(" ")[0]:
            return countyName, countyId
            
    return None, None

#Pass once for state abbreviaions       
        
with open("./countyIdByNameProcessed.csv", 'r+', encoding='utf-8') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)        
    for result in results:
        if len(result) > 0:
            if result[0] not in states:
                states.append(result[0])
                countyNamesPerState[result[0]] = dict()
            countyName = result[2]
            id = result[1]
            countyNamesPerState[result[0]][countyName] = id
            
#print(countyNameMatch("Autauga", "AL"))
            
mismatch = []            
foundIds = dict()            
duplicate = 0
            
with open("./gdppercapitaProcessed.csv", 'r+', encoding='utf-8') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)   

    with open("./gdppercapitaProcessedId.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
   
        for result in results:    
            if len(result) > 0:
                stateAbbr = result[3]    
                testName = result[1]
                _, countyId = countyNameMatch(testName, stateAbbr)
                
                if countyId == None:
                    mismatch.append(testName + ", " + stateAbbr)
                else:    
                    if countyId in foundIds:
                        duplicate = duplicate + 1
                    else:
                        foundIds[countyId] = True
                    result.insert(2, countyId)
                    writer.writerow(result)    
            
#print(mismatch)
print(len(mismatch))

for m in mismatch:
    print(m)
    
print(duplicate)
            
            
            
            
            
            
            
            
            
            
        
        
        
# 