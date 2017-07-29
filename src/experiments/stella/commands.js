stella = {};

var stellaChat = d3.select("#stella-chat");

stella.tasks = [];

stella.tasks.push({
  fullName: "adventure",
  names: ["adventure", "explore", "google", "maps", "random"],
  desc: "Create a new adventure which consists of multiple random stops in a normal path.",
  qualifiers: {
    location: ["around", "near", "at"],
    stops: ["stops", "waypoints", "layovers"],
    distance: ["distance", "radius"]
  },
  execute: function(command, nvpStructure) {

  }
});

stella.tasks.push({
  fullName: "analyze",
  names: ["analyze", "infer", "tell"],
  desc: "Analyze a body of text, an email, etc.",
  execute: function(command, nvpStructure) {

  }
});

stella.tasks.push({
  fullName: "commands",
  names: ["commands", "associated", "help"],
  desc: "Analyze a command and return the possible matches.",
  execute: function(command, nvpStructure) {

  }
});

stella.tasks.push({
  fullName: "date",
  names: ["date", "time", "what"],
  desc: "Show the current date and time.",
  execute: function(command, nvpStructure) {
    currentDate = new Date();
    stellaChat.html("<h4>" + "The time is currently " + "<br>" + currentDate.toDateString() + " " + currentDate.toISOString().split("T")[1].replace("Z", "") + "</h4>");
  }
});

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
  names: ["email", "gmail", "e-mail", "check", "look", "read"],
  desc: "Open the user's email client in the site.",
  execute: function(command, nvpStructure) {
    d3.select("#authorize-button").style("opacity", 1);
    d3.select("#logout-button").style("opacity", 1);
    d3.select("#email-display").style("display", "block");
  }
});

stella.tasks.push({
  fullName: "email-write",
  names: ["email", "gmail", "e-mail", "send", "write", "compose"],
  qualifiers: {
    recipient: ["to"],
    body: ["about", "contain", "body", "text"],
    subject: ["subject", "topic", "heading"]
  },
  desc: "Open the user's email client and write an email.",
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

    d3.select("#authorize-button").style("opacity", 1);
    d3.select("#logout-button").style("opacity", 1);
    d3.select("#email-display").style("display", "block");
  }
});

stella.tasks.push({
  fullName: "facebook",
  names: ["facebook", "message", "messenger", "fb"],
  qualifiers: {
    recipient: ["to"],
    body: ["about", "contain", "text", "message"]
  },
  desc: "Enable FaceBook integration, including sending messages.",
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

    d3.select("#authorize-button").style("opacity", 1);
    d3.select("#logout-button").style("opacity", 1);
    d3.select("#email-display").style("display", "block");
  }
});

stella.tasks.push({
  fullName: "google",
  names: ["google", "search", "look", "find"],
  desc: "Search Google for something.",
  qualifiers: {
    search: ["google", "for", "find"],
  },
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
  names: ["help", "about", "you"],
  desc: "Provide information about Stella.",
  execute: function(command, nvpStructure) {
    stellaChat.html("<h3>Hi, my name is Stella. I love to learn about language and information.</h3>" +
      "<h4>Dante Tam, a CS major at UC berkeley, created me on January 12th, 2017.</h4>" +
      "<h4>Write me a note and I'll try to find the most relevant information and tasks.</h4>" +
      //"<h4>Please type 'commands' for a list of commands.</h4>"
      "<p>Type in 'references' to see all my citations.</p>"
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
    d3.select("#authorize-button").style("opacity", 1);
    d3.select("#logout-button").style("opacity", 1);
    d3.select("#email-display").style("display", "block");
  }
});

/*
stella.tasks.push({
  fullName: "gmail",
  names: ["integrate", "connect", "read", "gmail", "email"],
  desc: "Integrate Stella with services such as Facebook and Gmail.",
  execute: function(command, nvpStructure) {
    stellaChat.html("<h3>I can integrate with the following services (WIP):</h3>"
    );
  }
});
*/

stella.tasks.push({
  fullName: "jeopardy",
  names: ["jeopardy", "answer", "question"],
  desc: "Answer a question about anything as best as possible.",
  execute: function(command, nvpStructure) {

  }
});

stella.tasks.push({
  fullName: "memo",
  names: ["memo", "memorandum", "message", "correspondence"],
  qualifiers: {
    from: ["from", "by"],
    to: ["to", "for"],
    about: ["subject", "topic", "about"],
  },
  desc: "Write a message or memo about a subject.",
  execute: function(command, nvpStructure) {
    //console.log(command);
    var from = "", to = "", about = "";

    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.from.indexOf(mainToken) !== -1) {
        from += nvpStructure[i].fullText.trim();
      }
      else if (this.qualifiers.to.indexOf(mainToken) !== -1) {
        to += nvpStructure[i].fullText.trim();
      }
      else if (this.qualifiers.about.indexOf(mainToken) !== -1) {
        about += nvpStructure[i].fullText.trim();
      }
    }

    var beginResponse = {from: from, to: to, taskCat: about};
    showStellaForm("memo", beginResponse);
  }
});

stella.tasks.push({
  fullName: "name",
  names: ["name", "call"],
  qualifiers: {
    name: ["is", "me"]
  },
  desc: "Provide the user's name to Stella.",
  execute: function(command, nvpStructure) {
    //console.log(command);
    var newName = "";
    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.name.indexOf(mainToken) !== -1) {
        newName += nvpStructure[i].fullText.trim();
      }
    }
    username = newName;
    stellaChat.html("<h3>Nice to meet you, " + newName + "!</h3>" );
    Cookies.set('userdata-username', newName, {expires: 700});
  }
});

/*
stella.tasks.push({
  fullName: "record",
  names: ["record", "tally", "log", "write", "down", "keep"],
  qualifiers: {
    expenseReg: [new RegExp('(@\S+)', 'gi')],
    date: ["today", "now", "yesterday", "week", "month", "year"],
    //here: ["here", "my", "home"]
  },
  desc: "Record something like an expense or an apppointment. Generally in the past.",
  execute: function(command, nvpStructure) {
    var tokens = command.fullCommand.split(" ");
    var expense = "", date = "", notes = "";

    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      for (var j = 0; j < this.qualifiers.expenseReg.length; j++) {
        var token = this.qualifiers.expenseReg[i];
        if (mainToken.match(token)) {
          expense += nvpStructure[i].fullText + " ";
        }
      }
      if (this.qualifiers.expenseReg.indexOf(mainToken) !== -1) {
        expense += nvpStructure[i].fullText;
      }
      else if (this.qualifiers.date.indexOf(mainToken) !== -1) {
        date += nvpStructure[i].fullText;
      }
      else {
        notes += nvpStructure[i].fullText;
      }
    }

  }
});
*/
stella.tasks.push({
  fullName: "record",
  names: ["record", "tally", "log", "write", "down", "keep"],
  qualifiers: {
    finance: ["finance", "expense", "revenue", "income", "receipt", "purchase"],
    time: ["task", "time", "job", "assignment", "project", "work"]
  },
  desc: "Record something like an expense or an apppointment. Generally in the past.",
  execute: function(command, nvpStructure) {
    d3.select("#stella-calendar").style("opacity", 1);

    var tokens = command.fullCommand.split(" ");
    for (var i = 0; i < tokens.length; i++) {
      var keys = Object.keys(this.qualifiers);
      var foundKey = null;
      for (var j = 0; j < keys.length; j++) {
        var qualifiers = this.qualifiers[keys[j]];

        if (qualifiers.indexOf(tokens[i]) !== -1) {
          foundKey = keys[j];
          break;
        }
      }
      if (foundKey !== null) {
        showStellaForm[findStellaFormName(foundKey)];
        break;
      }
    }
  }
});

stella.tasks.push({
  fullName: "references",
  names: ["reference", "references", "citation", "paper", "source", "academic", "cite", "thesis"],
  desc: "List all the references that Stella relies on.",
  execute: function(command, nvpStructure) {
    currentDate = new Date();

    stellaChat.html("<h4>References</h4>");
    stellaChat.html(stellaChat.html() +
      '<p>With help from the APIs: Google (Calendar, Gmail, Maps, Custom Search Engine, Finance, StaticMap); MediaWiki Wikipedia Content and Search; Facebook; Messenger; Yahoo (YQL, Finance); NASA GIBS</p>' +
      '<p>Princeton University "About WordNet." WordNet. Princeton University. 2010. &lt;http://wordnet.princeton.edu&gt;</p>' +
      '<p>Mihalcea, Tarau. "TextRank: Bringing Order into Texts." University of North Texas. 2005. &lt;https://web.eecs.umich.edu/~mihalcea/papers/mihalcea.emnlp04.pdf&gt;</p>' +
      '<p>S. Brin and L. Page. 1998. The anatomy of a large-scale hyper-textual Web search engine. Computer Networks and ISDN Systems, 30(1–7).</p>' +
      '<p>Pak, Paroubek. Twitter as a Corpus for Sentiment Analysis and Opinion Mining. Universit ́e de Paris-Sud, Laboratoire LIMSI-CNRS. 2011. &lt; http://web.archive.org/web/20111119181304/http://deepthoughtinc.com/wp-content/uploads/2011/01/Twitter-as-a-Corpus-for-Sentiment-Analysis-and-Opinion-Mining.pdf &gt;</p>' +
      '<p>Tan, Steinbach, Kumar. "Association Analysis: Basic Concepts and Algorithms." Introduction to Data Mining. Pearson, 2005. &lt; https://www-users.cs.umn.edu/~kumar/dmbook/ch6.pdf &gt;</p>' +
      '<p>Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14, no. 3, pp 130-137.</p>' +
      '<p>Manning, Christopher D., Mihai Surdeanu, John Bauer, Jenny Finkel, Steven J. Bethard, and David McClosky. 2014. The Stanford CoreNLP Natural Language Processing Toolkit In Proceedings of the 52nd Annual Meeting of the Association for Computational Linguistics: System Demonstrations, pp. 55-60.<p>' +
      '<p>Manning, Christopher D, et al. An Introduction to Information Retrieval. Cambridge, England, Cambridge University Press, 2009.</p>' +
      'Olah, Christopher. "Understanding LSTM Networks." Colah\'s Blog. N.p., 27 Aug. 2015. Web. 16 May 2017. <http://colah.github.io/posts/2015-08-Understanding-LSTMs/>.' +
      'O. Vinyals, Q.V. Le. A Neural Conversational Model. ICML Deep Learning Workshop, arXiv 2015.' +
      "<p>Inspired by UC Berkeley's CS 170 and CS 189 courses in algorithms and machine learning, as well as natural language processing.</p>" +
      '<p>Built with d3.js, Bootstrap, jQuery & AJAX, deployed with GitHub Pages.</p>' +
      '<p>Icons from game-icons.net.</p>' +
      '<p>Built by Dante Tam, as a curiosity and study in ML, NLP, and information science.</p>' +
      '<p>Contact datam@berkeley.edu</p>'
    );
  }
});

stella.tasks.push({
  fullName: "research",
  names: ["research", "search", "data"],
  desc: "Search Wikipedia's API for infoboxes and summaries.",
  qualifiers: {
    topic: ["research", "search", "data", "for", "find"]
  },
  execute: function(command, nvpStructure) {
    var properNounsString = "";

    var listToDefine = command.nouns.concat(command.adjectives, command.adjectiveSatellites); //command.properNouns
    for (var i = 0; i < listToDefine.length; i++) {
      if (this.names.indexOf(listToDefine[i].words[0]) !== -1 || this.qualifiers.topic.indexOf()) {
        continue;
      }
      properNounsString += listToDefine[i].words[0];
      if (i !== listToDefine.length - 1) {
        properNounsString += "+";
      }
    }
    listToDefine = listToDefine.concat(command.properNouns);
    for (var i = 0; i < command.properNouns.length; i++) {
      properNounsString += command.properNouns[i] + "+";
    }

    var callback = function(data) {
      var info = getMainBoxData(data);
      //console.log(summarizeLongData(data));
      console.log(removeAllTokens(data));
    };
    getWikipediaInfo([properNounsString], callback);

  }
});

stella.tasks.push({
  fullName: "satellite",
  names: ["satellite", "earth", "location", "image"],
  desc: "Generate a satellite image of a certain location.",
  qualifiers: {
    location: ["for", "at", "near", "around", "satellite", "image"],
    zoomLevel: ["zoom", "level", "size"]
  },
  execute: function(command, nvpStructure) {
    var tokens = command.fullCommand.split(" ");
    var startLocation = "";
    var zoomLevel = 12;

    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.location.indexOf(mainToken) !== -1) {
        startLocation = nvpStructure[i].fullText;
      }
      if (this.qualifiers.zoomLevel.indexOf(mainToken) !== -1) {
        zoomLevel = nvpStructure[i].fullText.replace(/[^\/\d]/g, "");
      }
    }

    var userLocationCallback = function(data, lat, lng) {
      var addr = data.results[0]["formatted_address"];
      console.log(addr);
      startLocation = addr;
      showMap(startLocation, zoomLevel);
    };

    startLocation.replace(/ /g, "+");

    console.log(command.fullCommand);
    console.log(startLocation.trim() + ":");

    if (command.fullCommand.indexOf("near me") !== -1 || command.fullCommand.indexOf("my location") !== -1 || command.fullCommand.indexOf("around me") !== -1 || command.fullCommand.indexOf("me") !== -1 || startLocation.trim() === "me") {
      //console.log(userLocation);
      getLocationDetailsByCoord(userLocation.coords.latitude, userLocation.coords.longitude, userLocationCallback);
      return;
    }

    showMap(startLocation, zoomLevel);
  }
});

stella.tasks.push({
  fullName: "time-series",
  names: ["time-series", "time", "series"],
  desc: "Visualize a progression of some data over time.",
  qualifiers: {

  },
  execute: function(command, nvpStructure) {

  }
});

function showMap(startLocation, zoomLevel) {
  var placeInfoCallback = function(data) {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("http") !== -1 || keys[i].indexOf(".svg") !== -1 || keys[i].indexOf(".png") !== -1) {
        continue;
      }
      if (data[keys[i]].indexOf("http") !== -1 || data[keys[i]].indexOf(".svg") !== -1 || data[keys[i]].indexOf(".png") !== -1) {
        continue;
      }
      stellaChat.html(stellaChat.html() + "<p>" + keys[i] + ": " + data[keys[i]] + "</p>");
    }
  };

  var imgName = getSatelliteImage(startLocation, zoomLevel);
  console.log(imgName);
  stellaChat.html(
    "<img src=" + imgName + "></img>"
  );

  getInfoOfPlace(startLocation, placeInfoCallback);
}

function returnDateFromString(timeNow, timeDelay) {
  var currentDate;
  if (timeNow.indexOf("now") !== -1) {
    currentDate = new Date();
  }
  else {
    currentDate = createDateAsUTC();
  }
  var tokens = timeDelay.split(" ");
  var currentNum = 0;
  for (var i = 0; i < tokens; i++) {
    var delay = timeDelay[i];
    if (!isNaN(delay)) {
      currentNum = parseFloat(delay);
    }
    else {
      if (delay.indexOf("hour") !== -1) {
        currentDate.setHours(currentDate.getHours() + currentNum);
      }
      else if (delay.indexOf("day") !== -1) {
        currentDate.setDate(currentDate.getDate() + currentNum);
      }
      else if (delay.indexOf("week") !== -1) {
        currentDate.setDate(currentDate.getDate() + currentNum * 7);
      }
      else if (delay.indexOf("month") !== -1) {
        currentDate.setDate(currentDate.getDate() + currentNum * 30);
      }
      else if (delay.indexOf("year") !== -1) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
      else {
        continue; //So that "now after 1 and days" is "now 1 day" which is 24 hours from the current UTC moment
      }
      currentNum = 0;
    }
  }
  return currentDate;
}

stella.tasks.push({
  fullName: "schedule",
  names: ["calendar", "schedule", "appointment", "alarm", "set", "reminder", "hour", "minutes", "day", "week", "month"],
  qualifiers: {
    time: ["at", "on"],
    delay: ["in", "after"],
    schedule: ["about", "schedule"],
    //here: ["here", "my", "home"]
  },
  desc: "Schedule an appointment or reminder through Stella's version of Keep.",
  execute: function(command, nvpStructure) {
    d3.select("#stella-calendar").style("opacity", 1);
    /*
    var boxes = d3.selectAll(".st-bg");
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].html("<p>Test</p>");
    }
    */

    currentDate = new Date();

    var tokens = command.fullCommand.split(" ");
    var startLocation = null, destination = null, query = [];

    var time = "now", delay = "";
    //Use the Trello API or Stella's version of Keep.
    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.time.indexOf(mainToken) !== -1) {
        time = nvpStructure[i].fullText;
      }
      if (this.qualifiers.delay.indexOf(mainToken) !== -1) {
        delay = nvpStructure[i].fullText;
      }
    }

    currentDate = returnDateFromString(time, delay);


  }
});

stella.tasks.push({
  fullName: "search-map",
  names: ["map", "direction", "search", "location", "find"],
  qualifiers: {
    destination: ["of", "to"],
    startingLocation: ["from", "starting"],
    query: ["nearby", "near", "nearest", "close", "closest"],
    //here: ["here", "my", "home"]
  },
  desc: "Search Google Maps for a location or a path from ",
  execute: function(command, nvpStructure) {
    var tokens = command.fullCommand.split(" ");
    var startLocation = null, destination = null, query = [];

    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].indexOf("here") !== -1 || tokens[i].indexOf("my") !== -1 || tokens[i].indexOf("home") !== -1) {
        startLocation = userLocation;
      }
    }
    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.destination.indexOf(mainToken) !== -1) {
        destination += nvpStructure[i].fullText + " ";
      }
      if (this.qualifiers.startingLocation.indexOf(mainToken) !== -1) {
        startLocation += nvpStructure[i].fullText;
      }
      if (this.qualifiers.query.indexOf(mainToken) !== -1) {
        query.push(nvpStructure[i].fullText);
      }
    }


  }
});

stella.tasks.push({
  fullName: "stocks",
  names: ["stocks", "symbol", "symbols", "finance"],
  qualifiers: {
    time: ["between", "during", "from"],
    symbols: ["for", "companies"]
  },
  desc: "Search Google Finance and other APIs for finance data about stocks.",
  execute: function(command, nvpStructure) {
    var tokens = command.fullCommand.split(" ");
    var timeString = "1 month";

    for (var i = 0; i < nvpStructure.length; i++) {
      var mainToken = nvpStructure[i].mainWord;
      if (this.qualifiers.time.indexOf(mainToken) !== -1) {
        timeString = nvpStructure[i].fullText + " ";
      }
    }

    stellaChat.html("");

    var listCompanies = [];
    for (var i = 0; i < command.properNouns.length; i++) {
      listCompanies.push(command.properNouns[i]);
    }
    stockSymbolLookup(listCompanies, timeString);

    for (var i = 0; i < listCompanies.length; i++) {
      getFinancialStories(listCompanies[i]);
    }
  }
});


//Summarize:
//Searches the web for encyclopedia articles, news articles, and other information as part of its research and summarization features.

stella.tasks.push({
  fullName: "trello",
  names: ["trello", "plan", "note", "write"],
  desc: "Integrate with the Trello API, and work with its boards and plans.",
  execute: function(command, nvpStructure) {

  }
});

stella.tasks.push({
  fullName: "wikipedia",
  names: ["wikipedia", "search", "encyclopedia"],
  desc: "Search Wikipedia for something.",
  qualifiers: {
    topic: ["for", ""]
  },
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
    for (var i = 0; i < command.properNouns.length; i++) {
      properNounsString += command.properNouns[i] + "+";
    }
    //properNounsString.replace(" ", "+");
    var win = window.open("https://en.wikipedia.org/w/index.php?search=" + properNounsString, '_blank');
    win.focus();
  }
});

function parseCommand(commandString) {
  var tokens = commandString.split(" ");
  var command = {
    fullCommand: "",
    commandWords: [],
    specialWebsitesAndThings: [],
    nouns: [],
    verbs: [],
    adjectives: [],
    adjectiveSatellites: [],
    adverbs: [],
    properNouns: [],
    questionWords: [],
    quotes: [],
    isQuestion: false
  };
  if (commandString.indexOf("?") !== -1) {
    command.isQuestion = true;
  }

  var inQuote = false;
  var currentQuote = "";
  var quoteLocations = [];
  for (var i = 0; i < commandString.length; i++) {
    if (commandString.charAt(i) === '"' || commandString.charAt(i) === "'") {
      quoteLocations.push(i);
      inQuote = !inQuote;
      if (!inQuote) {
        command.quotes.push(currentQuote);
        currentQuote = "";
      }
    }
    if (inQuote) {
      currentQuote += commandString.charAt(i);
    }
  }
  for (var i = quoteLocations.length - 1; i >= 0; i -= 2) {
    commandString = commandString.substring(0, quoteLocations[i - 1]) + commandString.substring(quoteLocations[i - 1], commandString.length);
  }

  for (var i = 0; i < tokens.length; i++) {
    /*if (specialWords.indexOf(tokens[i].toLowerCase()) !== -1) {
      command.specialExceptionWords.push(tokens[i].toLowerCase());
      continue;
    }*/
    command.fullCommand += tokens[i] + " ";
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
    tokens[i] = tokens[i].replace(/[^\w\s]/gi, '').toLowerCase();
    var id = wordsByName[tokens[i]];
    if (id === undefined || id === null) {
      tokens[i] = stemmer(tokens[i]);
      id = wordsByName[tokens[i]];
    }
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
function parseNounVerbPredicate(commandString, qualifiers=[]) {
  var tokens = commandString.replace(/[^\w\s]/gi, '').split(" ");
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

    //We see the variable isPreposition, under the following conditions:
    //the word is directly found in the list of prepositions,
    //the word is directly found in the list of conjunctions,
    //the word is directly found in the list of question words,
    //or the word is marked as a custom qualifier.
    var isPreposition = (prepositions[tokens[i].toLowerCase()] !== undefined && prepositions[tokens[i].toLowerCase()] !== null);
    var isConjunction = (conjunctions[tokens[i].toLowerCase()] !== undefined && conjunctions[tokens[i].toLowerCase()] !== null);
    var isDeterminer = (determiners[tokens[i].toLowerCase()] !== undefined && determiners[tokens[i].toLowerCase()] !== null);
    var isQuestionWord = (questionWords[tokens[i].toLowerCase()] !== undefined && questionWords[tokens[i].toLowerCase()] !== null);
    var isQualifier = qualifiers.indexOf(tokens[i].toLowerCase()) !== -1;

    //console.log(isConjunction + " " + tokens[i].toLowerCase());

    var syntacticCat = "";
    var newPhrase = isPreposition || isConjunction || isDeterminer || isQuestionWord;
    if (newPhrase) {
      if (isPreposition) syntacticCat = "P";
      else if (isConjunction) syntacticCat = "C";
      else if (isDeterminer) syntacticCat = "D";
      else if (isQuestionWord) syntacticCat = "D";
    }
    else {
      if (synset === undefined || synset === null) {
        syntacticCat = "N";
      }
      else {
        syntacticCat = synset.partOfSpeech.toUpperCase();
      }
    }

    //TODO: Simplify this odd logic
    if ((newPhrase && !lastTokenIsPreposition) || result.length === 0 || isQualifier) {
      lastTokenIsPreposition = true;
      result.push({
        type: syntacticCat + "P",
        mainWord: tokens[i],
        words: [],
        specialWords: [],
        fullText: ""
      });
    }
    else if (result.length === 0) {
      if (synset !== undefined) {
        result.push({
          type: syntacticCat + "P",
          mainWord: null,
          words: [synset],
          specialWords: [],
          fullText: ""
        });
      }
      else {
        result.push({
          type: syntacticCat + "P",
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
          type: syntacticCat + "P",
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
function findAllStellaTasksFromText(commandString) {
  var parsed = parseCommand(commandString);
  var relatedSynsets = [], definitionWords = [], relatedWords = [];

  for (var i = 0; i < parsed.nouns.length; i++) { //Come up with some special treatment for each part of speech later
    var taskRelatedWords = findAssociatedWords(parsed.nouns[i].words[0], degree=1);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }
  for (var i = 0; i < parsed.verbs.length; i++) {
    var taskRelatedWords = findAssociatedWords(parsed.verbs[i].words[0], degree=1);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }
  for (var i = 0; i < parsed.adjectives.length; i++) {
    var taskRelatedWords = findAssociatedWords(parsed.adjectives[i].words[0], degree=1);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }
  for (var i = 0; i < parsed.adjectiveSatellites.length; i++) {
    var taskRelatedWords = findAssociatedWords(parsed.adjectiveSatellites[i].words[0], degree=1);
    for (var j = 0; j < taskRelatedWords[0].length; j++) definitionWords.push(taskRelatedWords[0][j]);
    for (var j = 0; j < taskRelatedWords[2].length; j++) definitionWords.push(taskRelatedWords[2][j]);
    for (var j = 0; j < taskRelatedWords[1].length; j++) relatedSynsets.push(taskRelatedWords[1][j]);
  }

  //console.log(parsed);
  var taskRelatedWords = findAssociatedWords(parsed.specialWebsitesAndThings[i], degree=1);
  //console.log(taskRelatedWords);
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

  var result = {};

  for (var i = 0; i < stella.tasks.length; i++) {
    var taskSynsetWords = [];
    var names = stella.tasks[i].names;
    for (var j = 0; j < stella.tasks[i].names.length; j++) {
      taskSynsetWords.push(stella.tasks[i].names[j]);
      var taskRelatedWords = findAssociatedWords(stella.tasks[i].names[j], degree=1);
      for (var k = 0; k < taskRelatedWords[1].length; k++) {
        for (var l = 0; l < taskRelatedWords[1][k].words.length; l++) {
          taskSynsetWords.push(taskRelatedWords[1][k].words[l]);
        }
      }
    }

    var directNameMatches = findMatchesInStringArrays(names, relatedWords);
    var wordMatches = findMatchesInStringArrays(taskSynsetWords, relatedWords);
    var defMatches = findMatchesInStringArrays(taskSynsetWords, definitionWords);
    var matches = directNameMatches.length*2 + wordMatches.length;
    result[i] = matches;
  }

  return result;
}
function findStellaTaskRelatedToCommand(commandString) {
  var result = findAllStellaTasksFromText(commandString);

  var maxMatches = 0, maxIndex = -1;

  for (var i = 0; i < stella.tasks.length; i++) {
    var matches = result[i];
    if (matches > maxMatches || maxIndex == -1) {
      maxIndex = i;
      maxMatches = matches;
    }
  }

  return stella.tasks[maxIndex];
}

function findMatchesInStringArrays(list1, list2, disregard=[], disregardNonWords=false, stemForms=false) {
  var temp = {};
  var results = {};
  for (var i = 0; i < list1.length; i++) {
    var token = list1[i].toLowerCase();
    if (stemForms) {
      token = stemmer(token);
    }
    var disregardToken = false;
    for (var j = 0; j < disregard.length; j++) {
      if (disregard[j][token] !== undefined) {
        disregardToken = true;
        break;
      }
    }
    if (disregardNonWords) {
      if (wordsByName[token] === undefined) {
        disregardToken = true;
      }
    }
    temp[token] = !disregardToken;
  }
  for (var i = 0; i < list2.length; i++) {
    if (list2[i] === undefined) continue;
    var token = list2[i].toLowerCase();
    if (stemForms) {
      token = stemmer(token);
    }
    if (temp[token] === true && results[token] === undefined) {
      results[list2[i].toLowerCase()] = true;
    }
  }
  //console.log(list1);
  //console.log(list2);
  //console.log(Object.keys(results));
  return Object.keys(results);
}

function findWordMapForText(text) {
  text = text.replace(/[^\w\s?.!]|_/g, "");
  var results = Object.create(null);
  var tokens = text.split(/\s+/g)
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i].toLowerCase();
    if (!(token in results)) {
      results[token] = 0;
    }
    results[token]++;
  }
  return results;
}

//Intended for a Wikipedia article. Convert a whole text into a mapping of words where linked words are considered important
function findWordMap(text, exceptions=[], splitByChar=" ") {
  var results = {
    mainLinkedWords: {},
    otherWords: {}
  };
  var tokens = text.replace(/\n/g, " ").toLowerCase().split(splitByChar);
  for (var i = 0; i < tokens.length; i++) {
    if (exceptions.indexOf(tokens[i]) !== -1) {
      continue;
    }
    if (tokens[i].indexOf("{{") !== -1 || tokens[i].indexOf("File:") !== -1) {
      continue;
    }
    if (tokens[i].indexOf("[[") !== -1) {
      var newToken;
      if (tokens[i].indexOf("|") !== -1) {
        var split = tokens[i].split("|"); //This token is of the form [[ realWord (article name) | displayWord]]
        newToken = split[0].replace(/[^\w\s]/gi, '');
      }
      else {
        newToken = tokens[i].replace(/[^\w\s]/gi, '');
      }
      if (results.mainLinkedWords[tokens[i]] === undefined) {
        results.mainLinkedWords[newToken] = 0;
      }
      results.mainLinkedWords[newToken]++;
    }
    else {
      if (results.otherWords[tokens[i]] === undefined) {
        results.otherWords[tokens[i]] = 0;
      }
      results.otherWords[tokens[i]]++;
    }
  }
  var sortedMain = Object.keys(results.mainLinkedWords).sort(function(a,b) {return results.mainLinkedWords[b] - results.mainLinkedWords[a];});
  var sortedOther = Object.keys(results.otherWords).sort(function(a,b) {return results.otherWords[b] - results.otherWords[a];});

  var sortedOtherCount = [];
  for (var i = 0; i < sortedOther.length; i++) {
    var key = sortedOther[i];
    //console.log(key);
    sortedOtherCount.push(results.otherWords[key]);
  }

  //console.log(sortedOther);
  //console.log(sortedOtherCount);

  return {results: results, sortedOther: sortedOther, sortedOtherCount: sortedOtherCount};
}

//The term frequency - inverse document frequency algorithm for determining the importance of every word in a document
//It is simply the actual word count divided by its normal "background" rate of appearance, which acknowledges some words appear more frequently than others.
function frequencyMap(documentWordMappings) {
  var totalWordsPerDoc = Object.create(null);
  var results = Object.create(null);
  for (var i = 0; i < documentWordMappings.length; i++) {
    var exclude = Object.create(null);
    var docWords = Object.keys(documentWordMappings[i]);
    for (var j = 0; j < docWords.length; j++) {
      if (!(docWords[j] in exclude)) {
        exclude[docWords[j]] = true;
        if (totalWordsPerDoc[docWords[j]] === undefined) {
          totalWordsPerDoc[docWords[j]] = 0;
        }
        totalWordsPerDoc[docWords[j]]++;
      }
    }
  }
  for (var i = 0; i < documentWordMappings.length; i++) {
    var doc = documentWordMappings[i];
    var docWords = Object.keys(doc);
    for (var j = 0; j < docWords.length; j++) {
      var ftd = doc[docWords[j]]; //f(t,d), the raw frequency of the term t in document d
      var nt = totalWordsPerDoc[docWords[j]]; //n_t, the number of documents containing term t
      var tf = 1 + Math.log(ftd);
      var idf = Math.log(1 + documentWordMappings.length / nt);
      if (results[docWords[j]] === undefined) {
        results[docWords[j]] = 0;
      }
      if (idf !== 0) {
        results[docWords[j]] += tf/idf;
      }
      else {
        results[docWords[j]] += tf;
      }
    }
  }
  return results;
}
function frequencyMapText(texts) {
  var results = [];
  for (var i = 0; i < texts.length; i++) {
    results.push(findWordMapForText(texts[i]));
  }
  return frequencyMap(results);
}













//A comment to hold the line
