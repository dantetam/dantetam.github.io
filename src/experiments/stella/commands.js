stella = {};

stella.commands = [];

stella.commands.push({
  names: ["define", "explain", "tell"] //Possibly a priority list with more relevant words first?
});

function parseCommand(commandString) {
  var tokens = commandString.split(" ");
  var command = {
    nouns: [],
    verbs: [],
    adjectives: [],
    adjectiveSatellites: [],
    adverbs: []
  };
  for (var i = 0; i < tokens.length; i++) {
    var id = wordsByName[tokens[i]];
    if (id !== undefined && id !== null) {
      var synset = wordsById(id);
      if (synset.partOfSpeech === "n") command.nouns.push(synset);
      else if (synset.partOfSpeech === "v") command.verbs.push(synset);
      else if (synset.partOfSpeech === "a") command.adjectives.push(synset);
      else if (synset.partOfSpeech === "s") command.adjectiveSatellites.push(synset);
      else if (synset.partOfSpeech === "r") command.adverbs.push(synset);
    }
  }
  return command;
}
