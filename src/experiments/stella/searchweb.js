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
    var element = this.querySelectorAll("class,aria-hidden,a,itemprop,data-aria-label-part,lang,br,style");
    for (var index = element.length - 1; index >= 0; index--) {
      element[index].parentNode.removeChild(element[index]);
    }

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

//As described in Tan, Steinbach, Kumar, Introduction to Data Mining, Ch. 6, "Association Analysis: Basic Concepts and Algorithms."
/*
Kumar et al. define a frequent itemset as a set of correlated items.
The difficulty is in the naive O(2^n) complexity of finding such sets by permutating all combinations.
We acknowledge that in two cases:
the subset of a frequent itemset is also a frequent itemset, and
the superset of an infrequent itemset is also an infrequent itemset.
This helps us to establish correlations between words correctly and quickly in our sentence parser.
*/
function aprioriFrequentItemsets(wordsTotal, sentenceMaps) {
  var candidates = makePermutations(wordsTotal, 1);
  var i = 0;
  while (true) {
    var itemSets = makePermutations(candidates, 1);
    for (j = 0; j < itemSets.length; j++) {
      var count = aprioriFrequentItemsetsHelper(itemSets[i], sentenceMaps);
      if (count >= 0.2 * sentenceMaps.length) {
        console.log(itemSets[i] + ", found association " + count + "/" + sentenceMaps.length);
      }
      else {
        for (var k = 0; k < itemSets[i].length; k++) {
          var index = array.indexOf(item);
          if (index !== -1) {
            candidates.splice(index, 1);
          }
        }
      }
    }
  }
}
function aprioriFrequentItemsetsHelper(itemSet, sentenceMaps) {
  var count = 0;
  for (var i = 0; i < sentenceMaps.length; i++) {
    if (lookForItemsetInMap(sentenceMaps[i], itemSets)) {
      count++;
    }
  }
  return count;
}
function lookForItemsetInMap(map, set) {
  for (var i = 0; i < set.length; i++) {
    if (map[set[i]] === undefined) {
      return false;
    }
  }
  return true;
}
function makePermutations(set, size) {
  if (set.length < size) {
    return [null];
  }
  if (set.length == size) {
    return [set];
  }
  var results = [];
  for (var indexExclude = 0; indexExclude < set.length; indexExclude++) {
    var temp = set.slice(0, set.length);
    temp.splice(indexExclude, 1);
    var addResults = makePermutations(temp, size);
    for (var i = 0; i < addResults.length; i++) {
      if (addResults[i] === null)
        continue;
      results.push(addResults[i]);
    }
  }
  return results;
}

Array.prototype.unique = function(){
  var u = {}, a = [];
  for (var i = 0, l = this.length; i < l; ++i) {
    if (u.hasOwnProperty(this[i])) {
      continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
}

var temp = makePermutations(["a", "b", "c", "d", "e"], 1);
console.log(temp.unique());


function linkAnalyzeCallback(data) {
  //console.log(data);
  var xml = json2xml(data);
  //console.log(xml);
  var temp = getTextFromHtml(xml);
  //console.log(temp);
  var sentences = temp.split("\n");
  var newSentences = [];
  var wordsTotal = [];
  for (var i = 0; i < sentences.length; i++) {
    var sentence = sentences[i];

    var words = sentence.split(" ");
    for (var j = 0; j < words.length; j++) {
      wordsTotal.push(words[i]);
    }

    var structure = parseCommand(sentence);

    var newSentence = "";
    for (var i = 0; i < structure.nouns.length; i++) newSentence += structure.nouns[i] + " ";
    for (var i = 0; i < structure.adjectives.length; i++) newSentence += structure.adjectives[i] + " ";
    for (var i = 0; i < structure.properNouns.length; i++) newSentence += structure.properNouns[i] + " ";
    for (var i = 0; i < structure.commandWords.length; i++) newSentence += structure.commandWords[i] + " ";
    for (var i = 0; i < structure.specialWebsitesAndThings.length; i++) newSentence += structure.specialWebsitesAndThings[i] + " ";

    var map = findWordMapForText(newSentence);
    newSentences.push(map);
  }

  aprioriFrequentItemsets(wordsTotal, newSentences);

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
