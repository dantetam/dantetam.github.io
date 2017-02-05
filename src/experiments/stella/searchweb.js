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

String.prototype.replaceAll = function(str1, str2, ignore)
{
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

//Only use with trusted sources. This could potentially execute arbitrary JS code.
function getTextFromHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  $(tmp).find("p").each(function() {
    console.log(this);
  });
  return tmp.textContent || tmp.innerText || "";
}

var body = document.getElementsByTagName('body')[0];
var x2js = new X2JS();

function linkAnalyzeCallback(data) {
  var xml = x2js.json2xml_str(data);
  var text = getTextFromHtml(xml).replaceAll('&quot;', '"');
  console.log(text);
}

function lookGcseResults() {
  var elems = document.getElementsByClassName("gsc-webResult gsc-result");
  if (elems.length === 0) {
    setTimeout(lookGcseResults, 500);
  }
  else {
    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var links = $(elem).find("a.gs-title");
      if (links.length !== 0) {
        var link = links[0].href;
        if (checkIfValidSite(link)) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.onload = function() {

          }
          script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + link + '%22&format=json&diagnostics=false&callback=linkAnalyzeCallback';
          console.log('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + link + '%22&format=json&diagnostics=false&callback=linkAnalyzeCallback');
          document.getElementsByTagName('body')[0].appendChild(script);
        }
      }
      //console.log(elem);
    }
    var parsedTextOnly = "";
    $('.gsc-webResult, .gsc-result').each(function() {
      parsedTextOnly += $(this).text() + "\n";
    });
    //console.log(parsedTextOnly);
  }
}

















//A comment to hold the line.
