trustedWebsites = Object.create(null);
extraTrustedDomainLevels = {"edu": true, "gov": true};

function readFile(file, dataFunction) {
  var rawFile = new XMLHttpRequest();
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        dataFunction(allText);
        rawFile.abort();
        rawFile = null;
      }
    }
  }
  rawFile.open("GET", file, false);
  rawFile.send(null);
}

function parseTrustedWebsites() {
  var callback = function(allText) {
    var lines = allText.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var site = lines[i].trim().split(",")[1];
      trustedWebsites[site] = true;
    }
  }
  readFile("./trusted-websites.txt", callback);
}

parseTrustedWebsites();

function checkIfValidSite(siteUrl) {
  var tokens = siteUrl.split("/");
  //var foundTopLevelDomain = false;
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (token == "" || token.indexOf("http") != -1) {
      continue;
    }
    if (token in trustedWebsites) {
      return true;
    }
    var moreTokens = token.split(".");
    for (j = 0; j < moreTokens.length; j++) {
      var moreToken = moreTokens[j];
      if (moreToken in extraTrustedDomainLevels) {
        return true;
      }
    }
    return false;
  }
  return false;
}

/*
console.log(checkIfValidSite("http://google.com"));
console.log(checkIfValidSite("http://durrrr.edu"));
console.log(checkIfValidSite("http://durrrr.com/edu"));
console.log(checkIfValidSite("http://durrrr.com/durrrr.edu"));
console.log("http://google.com".split("/"));
*/

function lookGcseResults() {
  var elems = document.getElementsByClassName("gsc-webResult gsc-result");
  if (elems.length === 0) {
    setTimeout(lookGcseResults, 500);
  }
  else {
    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      console.log(elem);
    }
  }
}

















//A comment to hold the line.
