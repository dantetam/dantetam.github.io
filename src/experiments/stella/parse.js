var wordsByName = Object.create(null);
var wordsById = Object.create(null);
var prepositions = Object.create(null);
var conjunctions = Object.create(null);
var determiners = Object.create(null);

var specialWords = ["stella", "dante", "me", "you"];
var questionWords = ["can", "is", "what", "why", "where", "when", "who", "whom", "which", "whose", "how", "whither", "whence"];
wordsById[9191919] = {
  words: ["stella", "you"],
  partOfSpeech: "n",
  definition: "My name is Stella. I'm an artificial intelligence built on WordNet with d3.js as the front end. Dante Tam is my creator.",
  nyms: {}
};
wordsById[9191920] = {
  words: ["me"],
  partOfSpeech: "n",
  definition: "It's you, the user; the person I'm talking to; the tester",
  nyms: {}
};
wordsById[9191921] = {
  words: ["creator"],
  partOfSpeech: "n",
  definition: "Dante Tam; my creator; UC Berkeley CS major; 4x grand strategist",
  nyms: {}
};
wordsByName["stella"] = 9191919; wordsByName["you"] = 9191919;
wordsByName["me"] = 9191920;
wordsByName["dante"] = 9191921;

var specialWebsitesAndThings = ["google", "wikipedia", "facebook", "fb"];

var fileDisplayArea = document.getElementById('fileParse');

var username = Cookies.get('userdata-username') !== undefined ? Cookies.get('userdata-username') : null;

var currentDate = new Date();

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
  rawFile.onreadystatechange = function()
  {
    console.log("fired function " + file + ":" + rawFile.readyState + ", " + rawFile.status);
    if (rawFile.readyState === 4)
    {
      if (rawFile.status === 200 || rawFile.status == 0)
      {
        console.log(file + ":parse");
        var allText = rawFile.responseText;
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
        rawFile.abort();
        rawFile = null;
      }
    }
  }
  rawFile.open("GET", file, false);
  rawFile.send(null);
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

/*
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
*/

//readFile("https://en.wikipedia.org/wiki/Water", function(data) {});

function readPrepositions(file) {
  var dataFunction = function(allText) {
    var lines = allText.split("\n");
    for (var i = 0; i < lines.length; i++) {
      prepositions[lines[i].trim()] = true;
    }
  }
  readFile(file, dataFunction);
}

function readConjunctions(file) {
  var dataFunction = function(allText) {
    var lines = allText.split("\n");
    for (var i = 0; i < lines.length; i++) {
      conjunctions[lines[i].trim()] = true;
    }
  }
  readFile(file, dataFunction);
}

function readDeterminers(file) {
  var dataFunction = function(allText) {
    var lines = allText.split("\n");
    for (var i = 0; i < lines.length; i++) {
      determiners[lines[i].trim()] = true;
    }
  }
  readFile(file, dataFunction);
}

function readLexemeExceptions(file) {
  var dataFunction = function(allText) {
    var lines = allText.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var words = lines[i].split(" ");
      var derived = words[0], original = words[1];
      var id = wordsByName[original];
      wordsByName[derived] = id;
    }
  }
  readFile(file, dataFunction);
}















//A comment to hold the line
