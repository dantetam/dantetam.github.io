import csv
import operator

import urllib
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

states = []

countyNamesPerState = dict()


def countyNameMatch(testName, stateAbbr):
    testNameProcessed = testName.replace('"', "").replace("County", "").replace("Borough", "").replace("Parish", "").replace("Municipality", "").replace("City", "").replace("city", "").replace("and", "").strip()

    dictCountyNames = countyNamesPerState[stateAbbr.strip()]
    for countyName, countyId in dictCountyNames.items():
        countyNameProcessed = countyName.replace('"', "").replace("County", "").replace("Borough", "").replace("Parish", "").replace("Municipality", "").replace("City", "").replace("city", "").replace("and", "").strip()
        if testNameProcessed == countyNameProcessed:
            return countyName, countyId
        #if testName.split(" ")[0] == countyNameProcessed.split(" ")[0]:
            #return countyName, countyId
            
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
            
print(countyNameMatch("Juneau", "AK"))    
print(countyNameMatch("Juneau County", "AK"))  
print(countyNameMatch("Juneau Borough", "AK")) 

#print(countyNameMatch("Autauga", "AL"))
            
mismatch = []            
foundIds = dict()            
duplicateNum = 0
duplicates = []

with open("./religionRaw.csv", 'r+', encoding='utf-8') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: True, reader)   

    with open("./religionProcessedId.csv", 'w+') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
   
        for result in results:    
            if len(result) > 0:
                stateAbbr = result[1]    
                testName = result[0]
                _, countyId = countyNameMatch(testName, stateAbbr)
                
                if countyId == None:
                    mismatch.append(testName + ", " + stateAbbr)
                else:    
                    if countyId in foundIds:
                        duplicateNum = duplicateNum + 1
                        duplicates.append(foundIds[countyId])
                        duplicates.append(testName + ", " + stateAbbr)
                        
                        duplicates.append("-----")
                    else:
                        foundIds[countyId] = testName + ", " + stateAbbr 
                    result.insert(2, countyId)
                    writer.writerow(result)    
            
#print(mismatch)
print(len(mismatch))

for m in mismatch:
    print(m)
    
print(duplicateNum)
            
for duplicate in duplicates:
    print(duplicate)
            
            
            
            
            
            
            
            
        
        
        
# 