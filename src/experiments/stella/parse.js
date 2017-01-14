var wordsByName = Object.create(null);
var wordsById = Object.create(null);
var prepositions = Object.create(null);

var specialWords = ["stella", "dante", "me", "you"];

var fileDisplayArea = document.getElementById('fileParse');

var username = null;

/*
Takes a WordNet file and converts into JS data structures, where
wordsById[id] = {
  words: [], //List of words in synset
  partOfSpeech: partOfSpeech, //Abbrevation for part of speech (n,v,a,s,r)
  definition: null, //Given short definition (see readDefinitions() for in-depth definitions)
  nyms: {} //A dictionary of -nyms ordered by symbol keys e.g. {"&" : 001, 002, ...; "^" : 003, ...}
};
*/
function readWordNet(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function()
  {
    if (this.readyState === 4)
    {
      if (this.status === 200 || this.status == 0)
      {
        var allText = this.responseText;
        //fileDisplayArea.innerText = allText;
        //d3.select("#fileParse").html(allText);
        var lines = allText.split("\n");
        for (var i = 0; i < lines.length; i++) {
          if (!lines[i].includes("|")) continue;
          var splitByVertical = lines[i].split("|");
          var desc = splitByVertical[1].trim();
          var tokens = splitByVertical[0].split(" ");

          var id = +tokens[0];
          var partOfSpeech = tokens[2];
          var synsetWordCount = +tokens[3];

          wordsById[id] = {
            words: [],
            partOfSpeech: partOfSpeech,
            definition: null,
            nyms: {}
          };

          for (var synsetWordIndex = 0; synsetWordIndex < synsetWordCount; synsetWordIndex++) {
            var word = tokens[2*synsetWordIndex + 4];
            //var nymId = +tokens[2*synsetWordCount + 4 + 1];

            if (wordsByName[word] === undefined || wordsByName[word] === null) {
              wordsByName[word] = id;
            }
            else {
              if (typeof wordsByName[word] !== "object") {
                wordsByName[word] = [];
              }
              wordsByName[word].push(id);
            }
            wordsById[id].words.push(word);
          }

          wordsById[id]["definition"] = desc;

          var nymCount = +tokens[4 + 2*synsetWordCount];

          //console.log(nymCount);

          for (var nymIndex = 0; nymIndex < nymCount; nymIndex++) {
            var nymToken = tokens[4 + 2*synsetWordCount + 1 + 4*nymIndex];
            var nymId = tokens[4 + 2*synsetWordCount + 1 + 4*nymIndex + 1];
            if (wordsById[id].nyms[nymToken] === undefined || wordsById[id].nyms[nymToken] === null) {
              wordsById[id].nyms[nymToken] = [];
            }
            wordsById[id].nyms[nymToken].push(nymId);
          }

        }
      }
    }
  }
  rawFile.send(null);
  rawFile.abort();
  rawFile = null;
}

/*
Takes in a Gutenberg dictionary file ordered as
WORD IN ALL CAPSs
Defn: ...
WORD IN ALL CAPS
1. Defn: ...
2. Defn: ...
...
N. Defn: ...
and converts it into a map with words as keys and a list of other words as the associated definition
*/
function readDefinitions(file) {

}

function readPrepositions(file) {
  var rawFile2 = new XMLHttpRequest();
  rawFile2.open("GET", file, false);
  rawFile2.onreadystatechange = function()
  {
    if (this.readyState === 4)
    {
      if (this.status === 200 || this.status == 0)
      {
        var allText = this.responseText;
        console.log("Parsing prepositions with XMLHttpRequest");
        //fileDisplayArea.innerText = allText;
        //d3.select("#fileParse").html(allText);
        var lines = allText.split("\n");
        for (var i = 0; i < lines.length; i++) {
          prepositions[lines[i].trim()] = true;
        }
      }
    }
  }
  rawFile2.send(null);
  rawFile2 = null;
}















//A comment to hold the line
