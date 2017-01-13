var wordsByName = {};
var wordsById = {};

var fileDisplayArea = document.getElementById('fileParse');

function readWordNet(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function()
  {
    if (rawFile.readyState === 4)
    {
      if (rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        fileDisplayArea.innerText = allText;
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
            //if (wordsById[id] === undefined || wordsById[id] === null) {
              //
            //}
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
}

function readDefinitions(file) {

}
