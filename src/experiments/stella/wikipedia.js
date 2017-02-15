function getWikipediaContentForSearchStrings(strings, finalCallback=null) {
  var titles = [];
  var callback = function(rawContent) {
    //console.log("VVV");
    console.log(rawContent);
    titles.push(rawContent.query.search[0].title);
    if (titles.length === strings.length) {
      if (finalCallback !== null) {
        finalCallback(titles);
      }
    }
  }
  for (var i = 0; i < strings.length; i++) {
    //xdr("https://en.wikipedia.org/w/api.php?action=query&titles=" + subjects[i] + "&prop=revisions&format=json", "GET", callback);
    callWikipediaSearchAPI(strings[i], callback);
  }
}

var latestResult = [];
function getWikipediaContentForSubjects(subjects, finalCallback=null) {
  latestResult = [];
  var callback = function(rawContent) {
    var pages = rawContent["query"]["pages"];
    var keys = Object.keys(pages);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] !== -1) {
        var pageContent = pages[keys[j]]["revisions"][0]["*"];
        //pageContent = removeAllTokens(pageContent);
        //pageContent = pageContent.replace(/[^\w\s]/gi, '');
        //var wordMap = findWordMap(pageContent);
        //console.log(pageContent);
        //console.log(wordMap);
        latestResult.push(pageContent);
        if (latestResult.length === subjects.length && finalCallback !== null) {
          finalCallback(pageContent);
        }
      }
    }
  }
  for (var i = 0; i < subjects.length; i++) {
    //xdr("https://en.wikipedia.org/w/api.php?action=query&titles=" + subjects[i] + "&prop=revisions&format=json", "GET", callback);
    callWikipediaContentAPI(subjects[i], callback);
  }
}
//getWikipediaContentForSubjects(["Water"]);

function callWikipediaSearchAPI(subjectString, callback) {
  //var url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + subject + "&prop=revisions&rvprop=content&format=json";
  var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + subjectString + "&utf8=&format=json"

  $(document).ready(function() {
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(dataWeGotViaJsonp) {
        //console.log(dataWeGotViaJsonp);
        callback(dataWeGotViaJsonp);
      }
    });
  });
}

function callWikipediaContentAPI(subject, callback) {
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + subject + "&prop=revisions&rvprop=content&format=json";
  //console.log(url);

  $(document).ready(function() {
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(dataWeGotViaJsonp) {
        callback(dataWeGotViaJsonp);
      }
    });
  });
}

function getWikipediaInfo(strings, finalCallback = function(data) {console.log(data);}) {
  var callback = function(data) {
    getWikipediaContentForSubjects(data, finalCallback);
  };
  getWikipediaContentForSearchStrings(strings, callback);
}

function getMainBoxData(wikiText) {
  var result = {};
  var infoboxIndex = wikiText.indexOf("Infobox");
  var stack = 1;
  if (infoboxIndex !== -1) {
    var i = infoboxIndex;
    for (i = infoboxIndex; true; i++) {
      if (wikiText.substring(i, i+2) === "{{") {
        stack++;
      }
      else if (wikiText.substring(i, i+2) === "}}") {
        stack--;
      }
      if (stack == 0) {
        break;
      }
    }
    var infoboxString = wikiText.substring(infoboxIndex, i);
    var lines = infoboxString.split("|");
    for (var j = 0; j < lines.length; j++) {
      if (lines[j].indexOf("=") !== -1) {
        var pair = lines[j].split("=");
        result[pair[0].trim().replace(/[\[\{\(\]\}\)]+/g, '')] = pair[1].trim().replace(/[\[\{\(\]\}\)]+/g, '');
      }
    }
  }
  return result;
}

/*
function getMainBoxData(subjects) {
  getWikipediaContentForSubjects(subjects, function(data) {});
  //TODO: Use a stack to figure out when the {{ }} containing infobox ends (there are nested {{}})
  //Parse the information into a dictionary {}
  //Use the information later to create a description of an object in the adventure,
  //where the nearest town/object(park,mine,etc.) is documented.
}
*/

var defaultTokens = ["{{/}}", "[[/]]", "</>"];
function removeAllTokens(text, tokens=defaultTokens) {
  //console.log(text);
  //for (var i = 0; i < tokens.length; i++) {
    text = text.replace(/(\(.*?\)|\{\{.*?\}\}|\<.*?\>)*/g, "");
    text = text.replace(/(\(.*?\)|\{\{.*?\}\}|\<.*?\>)*/, "");
    //text = text.replace(/(\[\[File.*?\]\]) */g, "");
    text = text.replace(/(\[\[File.*?\.\]\])*/g, "");
    text = text.replace(/\[\[/g, "").replace(/\]\]/g, "");

  //}
  //console.log(text);
}

function getEnergy(mainTopicWikipediaData, text) {
  var energy = 0;
  var sentences = text.split(".");
  for (var i = 0; i < sentences.length; i++) {
    var sentence = sentences[i].replace(/[^\w\s]/gi, "");
    //console.log(sentence);
    energy += getEnergySentence(mainTopicWikipediaData, sentence);
    //console.log(sentence + ". has energy " + getEnergySentence(mainTopicWikipediaData, sentence));
  }
  return energy;
}

function getEnergySentence(mainTopicWikipediaData, sentence) {
  var tokens = sentence.split(" ");
  var energy = 0;
  var usedTokens = {};
  //console.log(mainTopicWikipediaData.results.otherWords);
  for (var i = 0; i < tokens.length; i++) {
    //console.log(tokens[i]);
    if (tokens[i] in usedTokens) continue;
    if (tokens[i] in prepositions) continue;
    if (tokens[i] in conjunctions) continue;
    if (tokens[i] in determiners) continue;
    //if (!(tokens[i].toLowerCase() in wordsByName)) continue;
    if (!(tokens[i] in mainTopicWikipediaData.results.otherWords)) continue;
    usedTokens[tokens[i]] = true;
    //var wordPrevalence = mainTopicWikipediaData.results.otherWords[tokens[i]];
    var wordPrevalence = 1;
    energy += wordPrevalence;
  }
  return energy;
}

function getTopSentencesFromText(mainTopicWikipediaData, text, numToSummarize=50) {
  var energySentence = {};
  var sentences = text.split(".");
  for (var i = 0; i < sentences.length; i++) {
    var sentence = sentences[i].replace(/[^\w\s]/gi, "");
    //console.log(sentence);
    energySentence[i] = getEnergySentence(mainTopicWikipediaData, sentence);
    //console.log(sentence + ". has energy " + getEnergySentence(mainTopicWikipediaData, sentence));
  }
  var sorted = Object.keys(energySentence).sort(function(a,b) {return energySentence[b] - energySentence[a];});
  var results = [];
  for (var i = 0; i < numToSummarize; i++) {
    results.push(sentences[sorted[i]]);
    //console.log(energySentence[sorted[i]]);
  }
  return results;
}












//A comment to hold the line.
