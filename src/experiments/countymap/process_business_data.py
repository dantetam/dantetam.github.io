import csv
import operator

def load_source(loadToFileName, saveToFileName, filterFunction):
    results = None
    with open(loadToFileName, 'r+') as csvfile:
        # handle header line, save it for writing to output file
        header = next(csvfile).strip("\n").split(",")
        reader = csv.reader(csvfile)
        results = filter(filterFunction, reader)

        with open(saveToFileName, 'w+') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(header)
            for result in results:
                writer.writerow(result)
        
def getNormalizedDictByMax(data):
    result = dict()
    max_value = max(data.values())  # maximum value
    for k,v in data.items():
        result[k] = v / max_value
    return result
        
#Sort the total data into many individual files        
names = [
    "AllSectors",
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
    "IndustriesNotClassified",
]        

idStrings = [
    "00",
    "11",
    "21",
    "22",
    "23",
    "31-33",
    "42",
    "44-45",
    "48-49",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "61",
    "62",
    "71",
    "72",
    "81",
    "99"
]

assert len(names) == len(idStrings)

for i in range(len(names)):
    load_source("./businessbycounty/BP_2015_00A1.csv", "./businessbycounty/processed/" + names[i] + ".csv", lambda row: row[4] == idStrings[i])
        
#load_source("./businessbycounty/BP_2015_00A1.csv", "./businessbycounty/processed/allsectors.csv", lambda row: row[4] == "00")

# Compile the proportions of various industries in every county;

countiesData = dict()

results = None
with open("./businessbycounty/processed/AllSectors.csv", 'r+') as csvfile:
    # handle header line, save it for writing to output file
    header = next(csvfile).strip("\n").split(",")
    reader = csv.reader(csvfile)
    results = filter(lambda row: len(row) > 0, reader)
    for result in results:
        #print(result)
        id = result[1]
        if (result[11] == ''):
            continue
        annPayroll = int(result[11])
        countiesData[id] = dict()
        #countiesData[id]["00"] = annPayroll
        
#print(countiesData["01001"])

#Store all annual payrolls in one array per county
for i in range(0,len(names),1):
  with open("./businessbycounty/processed/" + names[i] + ".csv", 'r+') as csvfile:
      header = next(csvfile).strip("\n").split(",")
      reader = csv.reader(csvfile)
      results = filter(lambda row: len(row) > 0, reader)
      for result in results:
          #print(result)
          id = result[1]
          category = result[4];
          if (result[11] == ''):
              continue
          countiesData[id][category] = int(result[11])

#print(countiesData["01001"]["21"])
normalizedAlabamaEcon = getNormalizedDictByMax(countiesData["01001"])        
sorted_normalizedAlabamaEcon = sorted(normalizedAlabamaEcon.items(), key=operator.itemgetter(1), reverse=True)
#sorted_normalizedAlabamaEcon = {names[idStrings.index(str(k))]:v for k,v in sorted_normalizedAlabamaEcon}        
print(sorted_normalizedAlabamaEcon)        
        
with open("./businessbycounty/processedpercentage/countiesindustry.csv", 'w+') as csvfile:        
    for k,v in countiesData.items(): 
        data = str(k)
        for k2,v2 in v.items():
            data += "," + str(v2)
        csvfile.write(data + "\n")
        
        
        
        
        
        
        
        
        
        
# 