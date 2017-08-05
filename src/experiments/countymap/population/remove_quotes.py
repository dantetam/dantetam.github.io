import csv

#writer = csv.writer(open("processedDemographics.csv", "w+"), quoting=csv.QUOTE_NONE)
#reader = csv.reader(open("ACS_15_5YR_S0601.csv", "r+"), skipinitialspace=True)

rows = []

with open('ACS_15_SPT_B01003_with_ann.csv', 'r+') as f:
    for row in csv.reader(f, delimiter=',', skipinitialspace=True):
        print(row)
        rows.append(','.join(row))
        
with open('populationProcessed.csv', 'w+') as f:
    for row in rows:
        row = row.replace('"',"") #.replace(" ", "")
        f.write(row + "\n")