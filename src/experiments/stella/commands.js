stella = {};

var stellaChat = d3.select("#stella-chat");

stella.tasks = [];

stella.tasks.push({
  fullName: "define",
  names: ["define", "explain", "tell"], //Possibly a priority list with more relevant words first?
  desc: "Define a word by dictionary definitions.",
  execute: function(command, nvpStructure) {
    var wordsString = "";
    var listToDefine = command.nouns.concat(command.verbs, command.adjectives, command.adjectiveSatellites, command.adverbs); //command.properNouns
    for (var i = 0; i < listToDefine.length; i++) {
      wordsString += listToDefine[i].words[0];
      if (i !== listToDefine.length - 1) {
        wordsString += ", ";
      }
    }
    listToDefine = listToDefine.concat(command.properNouns);
    stellaChat.html("<h3>Define the following words: " + wordsString + ".</h3>" );
    for (var i = 0; i < listToDefine.length; i++) {
      var definition = listToDefine[i].definition;
      stellaChat.html(stellaChat.html() + "<h4>" + listToDefine[i].words[0] + ": " + definition + "</h4>");
    }
  }
});

stella.tasks.push({
  fullName: "email",
  names: ["email", "gmail", "e-mail", "send"],
  qualifiers: {
    recipient: ["to"],
    body: ["about", "contain", "body", "text"],
    subject: ["subject", "topic", "heading"]
  },
  desc: "Open the user's email client.",
  execute: function(command, nvpStructure) {
    var tokens = command.fullCommand.split(" ");
    var recipients = "";
    var subject = "Inquiry:";
    var bodyText = "";
    if (username !== null && username !== undefined) {
      subject = "Inquiry from " + username + ":";
    }
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].indexOf("@") !== -1 || tokens[i].indexOf(".com") !== -1 || tokens[i].indexOf(".org") !== -1 || tokens[i].indexOf(".net") !== -1) {
        recipients += tokens[i] + ", "
      }
    }
    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.subject.indexOf(mainToken) !== -1) {
        subject += " " + nvpStructure[i].fullText;
      }
      if (this.qualifiers.body.indexOf(mainToken) !== -1) {
        bodyText += nvpStructure[i].fullText;
      }
      if (this.qualifiers.recipient.indexOf(mainToken) !== -1) {
        recipients += nvpStructure[i].fullText;
      }
    }

    var body = "Hello,%0D%0A%0D%0A" +
      bodyText +
      "%0D%0A%0D%0A" + //4 carriages and newlines
      "Sincerely,%0D%0A" +
      username + "%0D%0A%0D%0A" +
      "This message was sent by Stella, a sweet, language aware AI.%0D%0A" +
      "dantetam.github.io/src/experiments/stella/index.html";
    var win = window.open("mailto:" + recipients + "?subject=" + subject + "&body=" + body + "", '_blank');
    win.focus();
  }
});

stella.tasks.push({
  fullName: "google",
  names: ["google", "search", "look"],
  desc: "Search Google for something.",
  execute: function(command, nvpStructure) {
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

stella.tasks.push({
  fullName: "help",
  names: ["help", "about"],
  desc: "Provide information about Stella.",
  execute: function(command, nvpStructure) {
    stellaChat.html("<h3>Hi, my name is Stella. I love to learn about language and information.</h3>" +
      "<h4>Dante Tam, a CS major at UC berkeley, created me on January 12th, 2017.</h4>" +
      "<h4>Write me a note and I'll try to find the most relevant information and tasks.</h4>" +
      "<p>Princeton University \"About WordNet.\" WordNet. Princeton University. 2010. &lt;<a href=http://wordnet.princeton.edu>http://wordnet.princeton.edu</a>&gt;</p>"
    );
  }
});

stella.tasks.push({
  fullName: "integrate",
  names: ["integrate", "connect", "use"],
  desc: "Integrate Stella with services such as Facebook and Gmail.",
  execute: function(command, nvpStructure) {
    stellaChat.html("<h3>I can integrate with the following services (WIP):</h3>"
    );
  }
});

stella.tasks.push({
  fullName: "jeopardy",
  names: ["jeopardy", "answer", "question"],
  desc: "Answer a question about anything as best as possible.",
  execute: function(command, nvpStructure) {

  }
});

stella.tasks.push({
  fullName: "name",
  names: ["name", "is", "call", "me"],
  qualifiers: {
    name: ["is", "me"]
  },
  desc: "Provide the user's name to Stella.",
  execute: function(command, nvpStructure) {
    //console.log(command);
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
  fullName: "wikipedia",
  names: ["wikipedia", "research", "search", "encyclopedia"],
  desc: "Search Wikipedia for something.",
  execute: function(command, nvpStructure) {
    var properNounsString = "";
    var listToDefine = command.nouns.concat(command.adjectives, command.adjectiveSatellites); //command.properNouns
    for (var i = 0; i < listToDefine.length; i++) {
      properNounsString += listToDefine[i].words[0];
      if (i !== listToDefine.length - 1) {
        properNounsString += "+";
      }
    }
    listToDefine = listToDefine.concat(command.properNouns);
    //properNounsString.replace(" ", "+");
    var win = window.open("https://en.wikipedia.org/w/index.php?search=" + properNounsString, '_blank');
    win.focus();
  }
});

function parseCommand(commandString) {
  var tokens = commandString.replace(/[^\w\s]/gi, '').split(" ");
  var command = {
    fullCommand: commandString,
    commandWords: [],
    specialWebsitesAndThings: [],
    nouns: [],
    verbs: [],
    adjectives: [],
    adjectiveSatellites: [],
    adverbs: [],
    properNouns: [],
    questionWords: [],
    isQuestion: false
  };
  if (commandString.indexOf("?"))
  for (var i = 0; i < tokens.length; i++) {
    /*if (specialWords.indexOf(tokens[i].toLowerCase()) !== -1) {
      command.specialExceptionWords.push(tokens[i].toLowerCase());
      continue;
    }*/
    if (specialWebsitesAndThings.indexOf(tokens[i].toLowerCase()) !== -1) {
      command.specialWebsitesAndThings.push(tokens[i].toLowerCase());
      continue;
    }
    if (questionWords.indexOf(tokens[i].toLowerCase()) !== -1) {
      command.questionWords.push(tokens[i].toLowerCase());
      continue;
    }
    if (tokens[i].charAt(0) === tokens[i].charAt(0).toUpperCase()) {
      command.properNouns.push(tokens[i]);
      continue;
    }
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
      if (prepositions[tokens[i]] === undefined || prepositions[tokens[i]] === null) {
        command.properNouns.push(tokens[i]);
      }
    }
  }
  return command;
}

function getQualifiersFromTask(task) {
  if (task.qualifiers === undefined) {
    return [];
  }
  var results = [];
  var keys = Object.keys(task.qualifiers);
  for (var i = 0; i < keys.length; i++) {
    for (var j = 0; j < task.qualifiers[keys[i]].length; j++) {
      results.push(task.qualifiers[keys[i]][j]);
    }
  }
  return results;
}

/*
Parse a command like "please send an email to dante at 7:00 am with the subject hi and body hello" into a data structure like
"please / send -> an email / to -> dante / at -> 7:00 am / with the subject -> hi / and / body -> hello",
using the parts of speech of the words to separate sentences into prepositional/verb/adjective-noun (adj_satellite-noun?) phrases.

Qualifiers are optional special words that are intended to be used as like prepositions,
or words that create new object phrases. For example, given an email command we would want "subject", "body", etc. as qualifiers,
where we can then extract the requested contents of subject -> ... and body -> ...
*/
function parseNounVerbPredicate(commandString, qualifiers) {
  var tokens = commandString.replace(/[^\w\s]/gi, '').toLowerCase().split(" ");
  var processedTokens = [];
  var result = [];

  var lastTokenIsPreposition = false;
  for (var i = 0; i < tokens.length; i++) {
    var id = wordsByName[tokens[i]];
    var synset;
    if (id === null || id === undefined) {
      synset = undefined;
    }
    else {
      synset = wordsById[id];
    }

    //TODO: Simplify this odd logic
    var isPreposition = (prepositions[tokens[i].toLowerCase()] !== undefined && prepositions[tokens[i].toLowerCase()] !== null);
    isPreposition = isPreposition || qualifiers.indexOf(tokens[i].toLowerCase()) !== -1;
    if ((isPreposition && !lastTokenIsPreposition) || result.length === 0) {
      lastTokenIsPreposition = true;
      result.push({
        mainWord: tokens[i],
        words: [],
        specialWords: [],
        fullText: ""
      });
    }
    else if (result.length === 0) {
      if (synset !== undefined) {
        result.push({
          mainWord: null,
          words: [synset],
          specialWords: [],
          fullText: ""
        });
      }
      else {
        result.push({
          mainWord: null,
          words: [],
          specialWords: [tokens[i]],
          fullText: ""
        });
      }
      lastTokenIsPreposition = true;
    }
    else {
      if (synset === null || synset === undefined) {
        lastTokenIsPreposition = false;
        result[result.length - 1].specialWords.push(tokens[i]);
        result[result.length - 1].fullText += tokens[i] + " ";
      }
      else if (synset.partOfSpeech === "n" || synset.partOfSpeech === "a" || synset.partOfSpeech === "s") {
        lastTokenIsPreposition = false;
        result[result.length - 1].words.push(synset);
        result[result.length - 1].fullText += tokens[i] + " ";
      }
      else {
        lastTokenIsPreposition = true;
        result.push({
          mainWord: synset,
          words: [],
          specialWords: [],
          fullText: ""
        });
      }
    }
  }

  return result;
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
    return [[word],[],[word]];
  }
  if (typeof id === "object") id = id[0];
  var mainSynset = wordsById[id];
  if (mainSynset === null || mainSynset === undefined) {
    //console.log("Cannot find word " + word + ", with id " + id);
    return [[word],[],[word]];
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
  for (var i = 0; i < parsed.adjectiveSatellites.length; i++) {
    var taskRelatedWords = findAssociatedWords(parsed.adjectiveSatellites[i].words[0]);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }

  //console.log(parsed);
  var taskRelatedWords = findAssociatedWords(parsed.specialWebsitesAndThings[i]);
  console.log(taskRelatedWords);
  for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
  for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
  for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);

  for (var i = 0; i < relatedSynsets.length; i++) {
    for (var j = 0; j < relatedSynsets[i].words.length; j++) {
      relatedWords.push(relatedSynsets[i].words[j]);
    }
  }

  var split = commandString.replace(/[^\w\s]/gi, '').toLowerCase().split(" ");
  for (var i = 0; i < split.length; i++) {
    relatedWords.push(split[i]);
  }

  var maxMatches = 0, maxIndex = -1;

  for (var i = 0; i < stella.tasks.length; i++) {
    var taskSynsetWords = [];
    var names = stella.tasks[i].names;
    for (var j = 0; j < stella.tasks[i].names.length; j++) {
      taskSynsetWords.push(stella.tasks[i].names[j]);
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
    console.log(taskSynsetWords);
    console.log(relatedWords);
    console.log(definitionWords);
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
    temp[list1[i].toLowerCase()] = true;
  }
  for (var i = 0; i < list2.length; i++) {
    if (temp[list2[i].toLowerCase()] === true && results[list2[i].toLowerCase()] === undefined) {
      results[list2[i].toLowerCase()] = true;
    }
  }
  //console.log(list1);
  //console.log(list2);
  //console.log(Object.keys(results));
  return Object.keys(results);
}















//A comment to hold the line