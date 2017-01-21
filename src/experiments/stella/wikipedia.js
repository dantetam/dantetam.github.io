function getWikipediaContentForSubjects(subjects, finalCallback=null) {
  var result = [];
  var callback = function(rawContent) {
    var pages = rawContent["query"]["pages"];
    var keys = Object.keys(pages);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] !== -1) {
        var pageContent = pages[keys[j]]["revisions"][0]["*"];
        //pageContent = pageContent.replace(/[^\w\s]/gi, '');
        //var wordMap = findWordMap(pageContent);
        //console.log(pageContent);
        //console.log(wordMap);
        result.push(pageContent);
        if (finalCallback !== null) {
          finalCallback(pageContent);
        }
      }
    }
  }
  for (var i = 0; i < subjects.length; i++) {
    //xdr("https://en.wikipedia.org/w/api.php?action=query&titles=" + subjects[i] + "&prop=revisions&format=json", "GET", callback);
    callWikipediaAPI(subjects[i], callback);
  }
}
//getWikipediaContentForSubjects(["Water"]);

function callWikipediaAPI(subject, callback) {
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + subject + "&prop=revisions&rvprop=content&format=json";

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

function getMainBoxData(subjects) {
  getWikipediaContentForSubjects(subjects, function(data) {});
  //TODO: Use a stack to figure out when the {{ }} containing infobox ends (there are nested {{}})
  //Parse the information into a dictionary {}
  //Use the information later to create a description of an object in the adventure,
  //where the nearest town/object(park,mine,etc.) is documented.
}

function getEnergy(mainTopicWikipediaData, text) {
  var energy = 0;
  var sentences = text.split(".");
  for (var i = 0; i < sentences.length; i++) {
    console.log(sentence);
    var sentence = sentences[i].replace(/[^\w\s]/gi, "");
    energy += getEnergySentence(mainTopicWikipediaData, sentence);
  }
  return energy;
}

function getEnergySentence(mainTopicWikipediaData, sentence) {
  var tokens = sentence.split(" ");
  var energy = 0;
  console.log(mainTopicWikipediaData.results.otherWords);
  for (var i = 0; i < tokens.length; i++) {
    console.log(tokens[i]);
    if (tokens[i] in prepositions) continue;
    if (!(tokens[i] in mainTopicWikipediaData.results.otherWords)) continue;
    var wordPrevalence = mainTopicWikipediaData.results.otherWords[tokens[i]];
    energy += wordPrevalence;
  }
  return energy;
}










//A comment to hold the line.
