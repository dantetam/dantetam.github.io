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
        "Gini" : "./giniequality/ACS_15_5YR_B19083.csv|CountyId|GiniMeasure",
        
        "TotalPopulation" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC01",
        "TotalWhiteOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC20",
        "TotalBlackOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC21",
        "TotalIndianOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC22",
        "TotalAsianOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC23",
        "TotalPacificIslanderOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC24",
        "TotalOtherOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC25",
        "TotalMultiOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC26",
        "TotalHispanicOrigin" : "./selecteddemographics/processedDemographics.csv|CountyId|HC01_EST_VC28"
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
        
"""        
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
"""
educationStrings = [
        "BDG25"
]      

        
totalFile = "totalCountyCensusData.csv"        
        
allData = dict()     
allCountyIdsList = []
dataByCounty = dict()       
        
#Organize all data by type i.e. income, unemployment, etc.
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
                countyId = result[indexId].replace('"', "")
                countyData = result[indexData]
            
                newData[countyId] = countyData
                
                if countyId not in dataByCounty:
                    if "000" in countyId or len(countyId) != 5:
                        continue
                    allCountyIdsList.append(countyId)
                    dataByCounty[countyId] = dict()
                dataByCounty[countyId][dataName] = countyData
                      
                
        """
        with open(saveToFileName, 'w+') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(header)
            for result in results:
                writer.writerow(result)    
        """
    
    allData[dataName] = newData
    

def sanitizeNumber(num):
    try:
        return float(num)
    except ValueError:
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
    normalized1 = data1
    normalized2 = data2
    
    #normalized1 = guessNormalize(data1)
    #normalized2 = guessNormalize(data2)
    #assert len(data1) == len(data2)
    
    sumX, sumY, sumXY, sumX2, sumY2 = 0, 0, 0, 0, 0
    n = 0
    for k,v in normalized1.items():
        if k not in normalized2: 
            continue
        x = isNumber(sanitizeNumber(v))
        y = isNumber(sanitizeNumber(normalized2[k]))
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
    
def averageAndVariance(data):
    average = 0
    n = 0
    for k,v in data.items():
        x = isNumber(sanitizeNumber(v))
        if x == None:
            continue
        average += x
        n += 1.0
    average /= n
    
    variance = 0
    for k,v in data.items():
        x = isNumber(sanitizeNumber(v))
        if x == None:
            continue
        dm = x - average    
        variance += dm*dm
    variance /= n
    
    return average, variance

#Normalizes data according to the sample mean and sample variance    
def guessNormalize(data):
    average, variance = averageAndVariance(data)
    normalized = dict()
    
    for k,v in data.items():
        x = isNumber(sanitizeNumber(v))
        if x == None:
            continue
        tstat = (x - average) / variance
        normalized[k] = tstat
    
    return normalized
    
#print(guessNormalize({"a": 1, "b": 2, "c": 3, "d": 10}))
    
print(correlation(allData["SubstanceAbuse"], allData["GDPPerCapita"]))    
print(correlation(allData["SubstanceAbuse"], allData["Income"]))    
print(correlation(allData["SubstanceAbuse"], allData["Unemployment"]))         

#print(correlation(allData["Income"], allData["Poverty"]))    
#print(correlation(allData["Income"], allData["BDG25"]))    
        
#Calculate all possible permutations of the modes and their correlations
     
"""  
possibleCorrelations = dict()       
modesList = list(allModes.keys()) 
for i in range(len(modesList)):
    mode = modesList[i]
    for j in range(len(modesList)):
        if i <= j:
            continue
        otherMode = modesList[j]
        r = correlation(allData[mode], allData[otherMode])
        possibleCorrelations[mode + " : " + otherMode] = r
possibleCorrelationsSorted = sorted(possibleCorrelations.items(), key=lambda x: abs(x[1]), reverse=True)

for i in range(20):
    print(possibleCorrelationsSorted[i])        
"""        
    
        
        
        
        
        
        
        
#print(dataByCounty["01001"])

#for key in sorted(dataByCounty["01001"]):
    #print(key, dataByCounty["01001"][key])
    
#Write all this data to one file, each row is a county,
#the columns are all the possible modes alphabetized
dataTypes = []
for dataName,fileIdRate in allModes.items():
    dataTypes.append(dataName)
dataTypes = sorted(dataTypes)
dataTypes.insert(0, "CountyId")

with open(totalFile, 'w+') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(dataTypes) #csv header
    dataTypes.pop(0)
    for countyId in allCountyIdsList:
        totalCountyData = dataByCounty[countyId]
        result = [countyId]
        for key in sorted(dataTypes):
            #print(key, totalCountyData[key])
            if key not in totalCountyData or len(totalCountyData[key]) == 0:
                result.append("NA")
            else:
                result.append(sanitizeNumber(totalCountyData[key]))
        writer.writerow(result)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        
        
# 