import csv
import operator
import math

#Sort the total data into many individual files        
allModes = {
        "Unemployment" : "unemployment.csv|id|rate",
        "Income" : "povertyincome.csv|County ID|Median Household Income in Dollars",
        "Poverty" : "povertyincome.csv|County ID|All Ages in Poverty Percent",
        "PopulationDensity" : "./populationdensity/DEC_00_SF1_GCTPH1.US05PR.csv|CountyID|DENSITY_SQ_MILE",
        "SubstanceAbuse" : "./substanceabuse/substanceabuseProcessed.csv|FIPS|EstimatedAgeAdjustedDeathRateMin",
        "GDPPerCapita" : "./gdppercapita/gdppercapitaProcessedId.csv|CountyId|PerCapitaIncome",
    }
    
industryStrings = ["AllSectors",
        "AgricultureForestryFishingHunting",
        "MiningQuarryingOilGas",
        "Utilities",
        "Construction",
        "Manufacturing",
        "WholesaleTrade",
        "RetailTrade",
        "TransportationWarehousing",
        "Information",
        "FinanceInsurance",
        "RealEstate",
        "ProfessionalScientificTechnical",
        "Management",
        "AdministrativeSupportWaste",
        "Education",
        "HealthcareSocialAssistance",
        "ArtsEntertainmentRecreation",
        "AccommodationFood",
        "OtherServices",
        "IndustriesNotClassified"]
        
educationStrings = [
        "Total1824",
        "LHS1824",
        "HS1824",
        "SC1824",
        "BH1824",
        "TotalG25",
        "L9G25",
        "912G25",
        "HSG25",
        "SCG25",
        "ADG25",
        "BDG25",
        "GPG25"
    ]
        
allData = dict()        
        
for industryString in industryStrings:
    constr = "./businessbycounty/processed/" + industryString + ".csv|GEO.id2|PAYANN"
    allModes[industryString] = constr
    
for educationString in educationStrings:
    constr = "./education/simplifiedEducationCount.csv|CountyID|" + educationString
    allModes[educationString] = constr
    
for dataName,fileIdRate in allModes.items():
    newData = dict()

    tokens = fileIdRate.split("|")
    fileName = tokens[0]
    countyIdFieldName = tokens[1].replace('"', "")
    dataFieldName = tokens[2].replace('"', "")
    
    with open(fileName, 'r+') as csvfile:
        header = next(csvfile).strip("\n").split(",")
        header = [x.replace('"', "") for x in header]
        #for column in header:
            #print(column)
        
        reader = csv.reader(csvfile)
        results = filter(lambda row: True, reader)
     
        indexId = header.index(countyIdFieldName)
        indexData = header.index(dataFieldName)
           
        for result in results:
            if len(result) > 0:
                newData[result[indexId]] = result[indexData]

        """
        with open(saveToFileName, 'w+') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(header)
            for result in results:
                writer.writerow(result)    
        """
    
    allData[dataName] = newData
    
#print(allData["Income"])

def sanitizeNumber(num):
    numStr = num.replace('"', "").replace("$", "").replace(",", "")
    return numStr

def isNumber(s):
    result = None
    try:
        result = float(s)
    except ValueError:
        return None    
    return result
    
#Takes in two dictionaries of ideally aligned data
#and returns their r correlation value
def correlation(data1, data2):
    #assert len(data1) == len(data2)
    sumX, sumY, sumXY, sumX2, sumY2 = 0, 0, 0, 0, 0
    n = 0
    for k,v in data1.items():
        if k not in data2: 
            continue
        x = isNumber(sanitizeNumber(v))
        y = isNumber(sanitizeNumber(data2[k]))
        if x == None or y == None:
            continue
        n += 1
        sumX += x
        sumY += y
        sumXY += x*y
        sumX2 += x*x
        sumY2 += y*y
    top = n * sumXY - sumX * sumY
    bottom = math.sqrt(n * sumX2 - sumX * sumX) * math.sqrt(n * sumY2 - sumY * sumY)
    return top/bottom    
    
print(correlation(allData["Income"], allData["Poverty"]))    
print(correlation(allData["Income"], allData["BDG25"]))    
        
        
        
        
        
        
        
        
# 