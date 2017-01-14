stella = {};

var stellaChat = d3.select("#stella-chat");

stella.tasks = [];

stella.tasks.push({
  names: ["define", "explain", "tell"], //Possibly a priority list with more relevant words first?
  desc: "Define a word by dictionary definitions.",
  execute: function(command) {
    var wordsString = "";
    var listToDefine = command.nouns.concat(command.verbs, command.adjectives, command.adjectiveSatellites, command.adverbs); //command.properNouns
    for (var i = 0; i < listToDefine.length; i++) {
      wordsString += listToDefine[i].words[0];
      if (i !== listToDefine.length - 1) {
        wordsString += ", ";
      }
    }
    stellaChat.html("<h3>Define the following words: " + wordsString + ".</h3>" );
    for (var i = 0; i < listToDefine.length; i++) {
      var definition = listToDefine[i].definition;
      stellaChat.html(stellaChat.html() + "<h4>" + listToDefine[i].words[0] + ": " + definition + "</h4>");
    }
  }
});
stella.tasks.push({
  names: ["name", "is", "call", "me"],
  desc: "Provide the user's name to Stella.",
  execute: function(command) {
    var properNounsString = "";
    for (var i = 0; i < command.properNouns.length; i++) {
      properNounsString += command.properNouns[i];
      if (i !== command.properNouns.length - 1) {
        properNounsString += " ";
      }
    }
    username = properNounsString;
    stellaChat.html("<h3>Nice to meet you, " + username + "!</h3>" );
  }
});
stella.tasks.push({
  names: ["google", "search", "look"],
  desc: "Search Google for something.",
  execute: function(command) {
    var properNounsString = "";
    for (var i = 0; i < command.properNouns.length; i++) {
      properNounsString += command.properNouns[i];
      if (i !== command.properNouns.length - 1) {
        properNounsString += "+";
      }
    }
    var win = window.open("https://www.google.com/#safe=on&q=" + properNounsString, '_blank');
    win.focus();
  }
});

function parseCommand(commandString) {
  var tokens = commandString.replace(/[^\w\s]/gi, '').split(" ");
  var command = {
    fullCommand: commandString,
    commandWords: [],
    nouns: [],
    verbs: [],
    adjectives: [],
    adjectiveSatellites: [],
    adverbs: [],
    properNouns: []
  };
  for (var i = 0; i < tokens.length; i++) {
    if (specialWords.indexOf(tokens[i].toLowerCase()) !== -1) continue;
    var id = wordsByName[tokens[i].toLowerCase()];
    if (id !== undefined && id !== null) {
      if (typeof id === "number") id = [id];
      for (var j = 0; j < id.length; j++) {
        var synset = wordsById[id[j]];
        if (synset === undefined) {
          //console.log(id[j]);
          continue;
        }
        if (synset.partOfSpeech === "n") command.nouns.push(synset);
        else if (synset.partOfSpeech === "v") command.verbs.push(synset);
        else if (synset.partOfSpeech === "a") command.adjectives.push(synset);
        else if (synset.partOfSpeech === "s") command.adjectiveSatellites.push(synset);
        else if (synset.partOfSpeech === "r") command.adverbs.push(synset);
      }
    }
    else {
      if (tokens[i].charAt(0) === tokens[i].charAt(0).toUpperCase()) {
        command.properNouns.push(tokens[i]);
      }
      else {
        //console.log(Object.keys(prepositions));
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
function findAssociatedWords(word, degrees = 2) {
  var id = wordsByName[word];
  if (id === null || id === undefined) {
    //console.log(word);
    //console.log("Cannot find word: " + word);
    return [[],[],[]];
  }
  if (typeof id === "object") id = id[0];
  var mainSynset = wordsById[id];
  if (mainSynset === null || mainSynset === undefined) {
    //console.log("Cannot find word " + word + ", with id " + id);
    return null;
  }
  var closed = [];
  var queue;
  if (typeof id === "number") queue = [id];
  else queue = id.slice(0);
  for (var d = 0; d < degrees; d++) { //Traverse to a level of degrees
    var queueLen = queue.length; //Save the length of the queue so that we do it "in place" e.g. only traverse this level on this pass through
    for (var q = 0; q < queueLen; q++) {
      //console.log(">>>>" + queue[0]);
      //console.log(queue);
      var synset = wordsById[queue[0]];
      closed.push(+queue[0]); //Pop the first item in the queue and add it to the closed list
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
              queue.push(+listIds[j]); //Add its "neighbors" to the queue
            }
          }
        }
      }
    }
  }

  //console.log("Final result: ");
  //console.log(closed);

  var definition = {};
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
    //console.log(relatedSynset.words);
    var def = relatedSynset.definition.toLowerCase();
    if (def.indexOf('"') !== -1) {
      def = def.substring(0, def.indexOf('"'));
    }
    //console.log(">>>" + def);
    var words = def.replace(/[^\w\s]/gi, '').split(" ");
    for (var j = 0; j < words.length; j++) {
      var word = words[j];
      if (wordsByName[word] !== null && wordsByName[word] !== undefined) {
        extendedDefinition[words[j]] = true;
      }
    }
  }

  //console.log(Object.keys(extendedDefinition));

  return [Object.keys(definition), relatedSynsets, Object.keys(extendedDefinition)];
}

/*

*/
//TODO: Clean up this method.
function findStellaTaskRelatedToCommand(commandString) {
  var parsed = parseCommand(commandString);
  var relatedSynsets = [], definitionWords = [], relatedWords = [];

  for (var i = 0; i < parsed.nouns.length; i++) { //Come up with some special treatment for each part of speech later
    var taskRelatedWords = findAssociatedWords(parsed.nouns[i].words[0]);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }
  for (var i = 0; i < parsed.verbs.length; i++) {
    var taskRelatedWords = findAssociatedWords(parsed.verbs[i].words[0]);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }
  for (var i = 0; i < parsed.adjectives.length; i++) {
    var taskRelatedWords = findAssociatedWords(parsed.adjectives[i].words[0]);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }

  for (var i = 0; i < relatedSynsets.length; i++) {
    for (var j = 0; j < relatedSynsets[i].words.length; j++) {
      relatedWords.push(relatedSynsets[i].words[j]);
    }
  }

  var maxMatches = 0, maxIndex = -1;

  for (var i = 0; i < stella.tasks.length; i++) {
    var taskSynsetWords = [];
    var names = stella.tasks[i].names;
    for (var j = 0; j < stella.tasks[i].names.length; j++) {
      var taskRelatedWords = findAssociatedWords(stella.tasks[i].names[j]);
      for (var k = 0; k < taskRelatedWords[1].length; k++) {
        for (var l = 0; l < taskRelatedWords[1][k].words.length; l++) {
          taskSynsetWords.push(taskRelatedWords[1][k].words[l]);
        }
      }
    }
    var wordMatches = findMatchesInStringArrays(taskSynsetWords, relatedWords);
    var defMatches = findMatchesInStringArrays(taskSynsetWords, definitionWords);
    var matches = wordMatches.length + defMatches.length;
    console.log(matches + " matches for command '" + commandString + "' and task '" + stella.tasks[i].desc + "'");
    if (matches > maxMatches || maxIndex == -1) {
      maxIndex = i;
      maxMatches = matches;
    }
  }

  return stella.tasks[maxIndex];
}

function findMatchesInStringArrays(list1, list2) {
  var temp = {};
  var results = {};
  for (var i = 0; i < list1.length; i++) {
    temp[list1[i]] = true;
  }
  for (var i = 0; i < list2.length; i++) {
    if (temp[list2[i]] === true && results[list2[i]] === undefined) {
      results[list2[i]] = true;
    }
  }
  //console.log(list1);
  //console.log(list2);
  //console.log(Object.keys(results));
  return Object.keys(results);
}















//A comment to hold the line
