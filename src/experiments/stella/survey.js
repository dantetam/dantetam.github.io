//This file handles Stella's forms (small scale such as user input) as well as general .csv content (large scale such as a sample of ACS responses)

//TODO: Analyze databases of questionnaire answers (such as the ACS sample responses)
//use Google Charts to get charts of response rates and proportions,
//as well as means, std.dev., confidence intervals, etc., for certain answers like income
//as well as simple text queries such as "average income in the SF region not counting above $250000"

function parseDataAssociationText(text) {
  var result = {};

  var lines = text.split("\n");
  var currentColumn = "", currentColumnFullName = "";
  var lastLineAbbr = false;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    var tokens = lines[i].split(" ");
    if (lastLineAbbr) {
      lastLineAbbr = false;
      currentColumnFullName = lines[i].trim();
      result[currentColumn]["fullName"] = currentColumnFullName;
      continue;
    }
    if (tokens.length === 2) {
      if (tokens[0] === tokens[0].uppercase() && tokens[0] !== tokens[0].lowercase()) {
        currentColumn = tokens[0];
        lastLineAbbr = true;
        result[currentColumn] = {fullName: "", data: {}};
        continue;
      }
    }
    //The line is a key-value pair association for the current column
    var tokens = lines[i].split(" .");
    var key = tokens[0].trim();
    var value = tokens[1];
    result[currentColumn]["data"][key] = value;
  }

  return result;
}

//csvRow is of the format "DATA_1,DATA_2,...,DATA_N" directly as numbers from the CSV file
//columns contains ["COL1", "COL2", ...]
//associations is the file parsed in parseDataAssociationText(<associations file>)
//One example is this file is the ACS manual found here:
//http://www2.census.gov/programs-surveys/acs/tech_docs/pums/data_dict/PUMS_Data_Dictionary_2011-2015.txt
function convertRowToText(csvRow, columnsList, associations) {
  var tokens = csvRow.split(",");
  var result = {};
  if (tokens.length === columnsList.length) {
    for (var i = 0; i < tokens.length; i++) {
      var fullColString = associations[columnsList[i]]["fullName"];
      var numberToText = associations[columnsList[i]]["data"][tokens[i]];
      result[fullColString] = numberToText;
    }
  }
  return result;
}

function convertTextToRow(commaText, columnsList, associations) {

}














//A comment to hold the line.
