function getWikipediaContentForSubjects(subjects) {
  var callback = function(rawContent) {
    var pages = rawContent["query"]["pages"];
    var keys = Object.keys(pages);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] !== -1) {
        var pageContent = pages[keys[j]]["revisions"][0]["*"];
        //pageContent = pageContent.replace(/[^\w\s]/gi, '');
        var wordMap = findWordMap(pageContent);
        //console.log(pageContent);
        //console.log(wordMap);
      }
    }
  }
  for (var i = 0; i < subjects.length; i++) {
    //xdr("https://en.wikipedia.org/w/api.php?action=query&titles=" + subjects[i] + "&prop=revisions&format=json", "GET", callback);
    var url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + subjects[i] + "&prop=revisions&rvprop=content&format=json";

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
}

getWikipediaContentForSubjects(["Water"]);











//A comment to hold the line.
