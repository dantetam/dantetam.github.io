trustedWebsites = Object.create(null);
trustedWebsitesList = null;
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
      if (lines[i].trim().length === 0) continue;
      var site = lines[i].trim().split(",")[1];
      trustedWebsites[site] = true;
      trustedWebsites["www." + site] = true;
    }
    trustedWebsitesList = Object.keys(trustedWebsites);
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
    for (var j = 0; j < trustedWebsitesList.length; j++) {
      if (token.indexOf(trustedWebsitesList[j]) !== -1) {
        return true;
      }
    }

    var moreTokens = token.split(".");
    for (var j = 0; j < moreTokens.length; j++) {
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

jQuery.fn.removeAttributes = function() {
  return this.each(function() {
    var attributes = $.map(this.attributes, function(item) {
      return item.name;
    });
    var img = $(this);
    $.each(attributes, function(i, item) {
    img.removeAttr(item);
    });
  });
}

//Only use with trusted sources. This could potentially execute arbitrary JS code.
function getTextFromHtml(html) {
  var result = "";
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  $(tmp).find("p").each(function() {
    //console.log(this);

    var element = this.querySelectorAll("class,aria-hidden,a,itemprop,data-aria-label-part,lang,br,style");
    for (var index = element.length - 1; index >= 0; index--) {
      element[index].parentNode.removeChild(element[index]);
    }

    //console.log(this);

    if (this.textContent === null || this.textContent === undefined || this.textContent === "") {

    }
    else {
      result += (this.textContent || "") + "\n";
    }
  });
  return result;
}

var body = document.getElementsByTagName('body')[0];

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/
*/
function json2xml(o, tab="") {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}


function linkAnalyzeCallback(data) {
  //console.log(data);
  var xml = json2xml(data);
  //console.log(xml);
  var temp = getTextFromHtml(xml);
  //console.log(temp);
}

function lookGcseResults() {
  var elems = document.getElementsByClassName("gsc-webResult gsc-result");
  if (elems.length <= 5) {
    setTimeout(lookGcseResults, 2500);
  }
  else {
    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var links = $(elem).find("a.gs-title");
      if (links.length !== 0) {
        var link = links[0].href;
        console.log(link + ", Valid: " + checkIfValidSite(link));
        if (checkIfValidSite(link)) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.onload = function() {

          }
          script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + link + '%22&format=json&diagnostics=false&callback=linkAnalyzeCallback';
          //console.log('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + link + '%22&format=json&diagnostics=false&callback=linkAnalyzeCallback');
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