stella = {};

stella.commands = [];

stella.commands.push({
  names: ["define", "explain", "tell"], //Possibly a priority list with more relevant words first?
  execute: function() {return 5;}
});
stella.commands.push({
  names: ["name", "is"],
  execute: function() {return 5;}
});
stella.commands.push({
  names: ["google", "search", "look"],
  execute: function() {return 5;}
});

function parseCommand(commandString) {
  var tokens = commandString.split(" ");
  var command = {
    nouns: [],
    verbs: [],
    adjectives: [],
    adjectiveSatellites: [],
    adverbs: [],
    properNouns: []
  };
  for (var i = 0; i < tokens.length; i++) {
    var id = wordsByName[tokens[i].toLowerCase()];
    if (id !== undefined && id !== null) {
      var synset = wordsById[id];
      if (synset.partOfSpeech === "n") command.nouns.push(synset);
      else if (synset.partOfSpeech === "v") command.verbs.push(synset);
      else if (synset.partOfSpeech === "a") command.adjectives.push(synset);
      else if (synset.partOfSpeech === "s") command.adjectiveSatellites.push(synset);
      else if (synset.partOfSpeech === "r") command.adverbs.push(synset);
    }
    else {
      if (tokens[i].charAt(0) === tokens[i].charAt(0).toUpperCase()) {
        command.properNouns.push(tokens[i]);
      }
      else {
        if (prepositions[tokens[i]] === undefined || prepositions[tokens[i]] === null) {
          command.properNouns.push(tokens[i]);
        }
      }
    }
  }
  return command;
}

/*
Given a word, it finds a list of direct similarly related words,
a list of words in the direct definition, as well as the words in the related words' definitions.
*/
function findAssociatedWords(word, degrees = 3) {
  var id = wordsByName[word];
  if (id === null || id === undefined) return;

  var closed = [];
  var queue = [id];
  for (var d = 0; d < degrees; d++) { //Traverse to a level of degrees
    var queueLen = queue.length; //Save the length of the queue so that we do it "in place" e.g. only traverse this level on this pass through
    for (var q = 0; q < queueLen; q++) {
      //console.log(">>>>" + queue[0]);
      //console.log(queue);
      var synset = wordsById[queue[0]];
      closed.push(+queue[0]);
      queue.splice(0, 1);
      //console.log(synset);
      var nymsSymbols = Object.keys(synset.nyms);
      var allowedSymbols = ["@", "@i", "~", "~i", "#m", "#s", "#p", "%m", "%s", "%p", "&", "^", "$"];
      for (var i = 0; i < nymsSymbols.length; i++) {
        if (allowedSymbols.indexOf(nymsSymbols[i]) !== -1) {
          var listIds = synset.nyms[nymsSymbols[i]];
          for (var j = 0; j < listIds.length; j++) {
            if (closed.indexOf(+listIds[j]) === -1 && queue.indexOf(+listIds[j]) === -1) {
              //console.log("Pushed " + listIds[j])
              //console.log("into the queue:")
              //console.log(queue);
              queue.push(+listIds[j]);
            }
          }
        }
      }
    }
  }

  //console.log("Final result: ");
  //console.log(closed);

  var definition = {};
  var mainSynset = wordsById[id];
  var mainDefWords = mainSynset.definition.toLowerCase().replace(/[^\w\s]/gi, '').split(" ");
  for (var i = 0; i < mainDefWords.length; i++) {
    if (wordsByName[mainDefWords[i]] !== null && wordsByName[mainDefWords[i]] !== undefined) {
      definition[mainDefWords[i]] = true;
    }
  }

  var extendedDefinition = {};
  var relatedSynsets = [];
  for (var i = 0; i < closed.length; i++) {
    var relatedSynset = wordsById[closed[i]];
    relatedSynsets.push(relatedSynset);
    console.log(relatedSynset.words);
    var def = relatedSynset.definition.toLowerCase();
    if (def.indexOf('"') !== -1) {
      def = def.substring(0, def.indexOf('"'));
    }
    console.log(">>>" + def);
    var words = def.replace(/[^\w\s]/gi, '').split(" ");
    for (var j = 0; j < words.length; j++) {
      var word = words[j];
      if (wordsByName[word] !== null && wordsByName[word] !== undefined) {
        extendedDefinition[words[j]] = true;
      }
    }
  }

  console.log(Object.keys(extendedDefinition));

  return [Object.keys(definition), relatedSynsets, Object.keys(extendedDefinition)];
}

function findStellaTaskRelatedToCommand(commandString) {
  var command = parseCommand(commandString);
  for ()
}












//A comment to hold the line
