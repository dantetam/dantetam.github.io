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
        result[currentColumn] = {fullName: "", associations: {}};
        continue;
      }
    }
    //The line is a key-value pair association for the current column
    var tokens = lines[i].split(" .");
    var key = tokens[0].trim();
    var value = tokens[1];
    result[currentColumn]["associations"][key] = value;
  }

  return result;
}














//A comment to hold the line.
