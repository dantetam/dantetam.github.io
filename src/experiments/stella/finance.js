// url='http://chartapi.finance.yahoo.com/instrument/1.0/YHOO%2CAAPL%2CGOOG%2CMSFT/chartdata;type=quote;range=1d/xml'

var latestQueryNames = []; //Handle all the callback nonsense globally
var latestQueryLen = 0;
var latestTimeString = "1 month";
var latestSymbolQuery = [];

function parseStockSymbol(data) {
  //console.log("Call");
  var results = data["ResultSet"]["Result"];

  console.log("VVV");
  console.log(results[0]);
  //for (var i = 0; i < results.length; i++) {
  //console.log(results[0]);
  latestSymbolQuery.push(results[0]);
  //}
  //console.log(latestSymbolQuery.length + " " + latestQueryLen)
  if (latestSymbolQuery.length === latestQueryLen) {
    getDataForSymbols(latestSymbolQuery);
    getEPSData(latestSymbolQuery);

    stellaChat.html("");
    for (var i = 0; i < latestSymbolQuery.length; i++) {
      var imageLink = getGoogleFinanceChart(latestSymbolQuery[i].symbol, latestTimeString);
      stellaChat.html(stellaChat.html() +
      "<h4>" + latestQueryNames[i] + "/" + latestSymbolQuery[i].symbol + "." + latestTimeString + "</h4><p>" +
      "<h4>" + latestSymbolQuery[i].toString() + "</h4>" +
      "<img src=" + imageLink + "></img><p/><hr/>");
    }
  }
}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

function jsonCallback() {
  //console.log("hiii");
}

function stockSymbolLookup(companyNames, timeString="1 month") {
  latestQueryNames = companyNames;
  latestSymbolQuery = [];
  latestQueryLen = companyNames.length;
  latestTimeString = timeString;
  for (var i = 0; i < companyNames.length; i++) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {

    }
    script.src = 'https://autoc.finance.yahoo.com/autoc?query=' + companyNames[i] + '&region=US&lang=en-US&diagnostics=false&callback=parseStockSymbol';
    console.log('https://autoc.finance.yahoo.com/autoc?query=' + companyNames[i] + '&region=US&lang=en-US&diagnostics=false&callback=parseStockSymbol')
    document.getElementsByTagName('body')[0].appendChild(script);

    /*
    var url = 'https://autoc.finance.yahoo.com/autoc?query=' + companyNames[i] + '&region=CA&lang=en-CA&diagnostics=true&callback=parseStockSymbol';

    $(document).ready(function() {
      $.ajax({
        //type: "OPTIONS",
        url: url,
        dataType: 'jsonp',
        jsonp: false,
        jsonpCallback: 'jsonCallback',
        success: function(dataWeGotViaJsonp) {
          //console.log(dataWeGotViaJsonp);
          callback(dataWeGotViaJsonp);
        }
      });
    });
    */
  }
  return latestSymbolQuery;
}

function getGoogleFinanceChart(symbol, time) {
  var timeString = "1M";
  if (time !== null && time !== undefined) {
    if (time.indexOf("day") !== -1) {
      time = time.replace("day", "");
      timeString = time.trim() + "D";
    }
    else if (time.indexOf("week") !== -1) {
      time = time.replace("week", "");
      timeString = new Number(time.trim())*7 + "D";
    }
    else if (time.indexOf("month") !== -1) {
      time = time.replace("month", "");
      timeString = time.trim() + "M";
    }
    else if (time.indexOf("year") !== -1) {
      time = time.replace("year", "");
      timeString = time.trim() + "Y";
    }
  }
  return "https://www.google.com/finance/getchart?q=" + symbol + "&p=" + timeString + "&i=4000";
}

function financeAnalyze(data) {
  console.log(data);
  var results = data["query"]["results"]["quote"];
  var collatedResults = [];
  for (var i = 0; i < results.length; i++) {

  }

  //stellaChat.html("");
  stellaChat.html(stellaChat.html() + "<hr>");
  for (var i = 0; i < latestSymbolQuery.length; i++) {
    var collatedResultsString = "";
    var collatedResults = results[i];
    if (collatedResults === undefined) {
      collatedResults = results;
    }
    var keys = Object.keys(collatedResults);
    for (var j = 0; j < keys.length; j++) {
      if (collatedResults[keys[j]] !== null) {
        collatedResultsString += "<p>" + keys[j] + ": " + collatedResults[keys[j]] + "</p>";
      }
    }
    var imageLink = getGoogleFinanceChart(latestSymbolQuery[i].symbol, latestTimeString);
    stellaChat.html(stellaChat.html() +
    "<h4>" + latestQueryNames[i] + "/" + latestSymbolQuery[i].symbol + ". " + latestTimeString + "</h4><p>" +
    "<h4>" + JSON.stringify(latestSymbolQuery[i]) + "</h4>" +
    "<img src=" + imageLink + "></img><p/><hr/>" +
    "<h4>" + latestQueryNames[i] + "/" + latestSymbolQuery[i].symbol + ". " + latestTimeString + "</h4><p>" +
    collatedResultsString);
  }
}

function getDataForSymbols(listOfStockSymbols) {
  var tickerString = "";
  for (var i = 0; i < listOfStockSymbols.length; i++) {
    tickerString += "%22" + listOfStockSymbols[i].symbol + "%22";
    if (i !== listOfStockSymbols.length - 1) {
      tickerString += ",";
    }
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = function() {

  }
  //script.src = 'https://chartapi.finance.yahoo.com/instrument/1.0/' + tickerString + '/chartdata;type=quote;range=1d/json/?callback=financeAnalyze';
  //script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20pm.finance.graphs%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&diagnostics=true&callback=finance';
  //script.src = 'https://autoc.finance.yahoo.com/autoc?query=' + tickerString +
  script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(' + tickerString + ')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=financeAnalyze'
  body.appendChild(script);
}

function getTablesFromHTML(html) {
  var result = "";
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  console.log(html);
  $(tmp).find("table").each(function() {
    //console.log(this);
    var indicatorOfCorrectTable = this.querySelectorAll("ipos");
    //console.log(indicatorOfCorrectTable);
  });
  return result;
}

function analyzeEPS(data) {
  var xml = json2xml(data);
  var tables = getTablesFromHTML(xml);
}

function getEPSData(listOfStockSymbols) {
  for (var i = 0; i < listOfStockSymbols.length; i++) {
    var symbol = listOfStockSymbols[i].symbol;
    //console.log(symbol);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {

    }
    //script.src = 'https://chartapi.finance.yahoo.com/instrument/1.0/' + tickerString + '/chartdata;type=quote;range=1d/json/?callback=financeAnalyze';
    //script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20pm.finance.graphs%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&diagnostics=true&callback=finance';
    //script.src = 'https://autoc.finance.yahoo.com/autoc?query=' + tickerString +
    script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http://www.nasdaq.com/symbol/' + symbol + '/revenue-eps%22&format=json&diagnostics=false&callback=analyzeEPS';
    body.appendChild(script);
  }
}

function getLinksFromHtml(html, validFunctionFilter=function(href) {return true;}) {
  var result = [];
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;

  $(tmp).find("a").each(function() {
    if (!validFunctionFilter(this)) {
      return;
    }

    //var element = this.querySelectorAll("class,aria-hidden,p,itemprop,data-aria-label-part,lang,br,style");
    //for (var index = element.length - 1; index >= 0; index--) {
      //element[index].parentNode.removeChild(element[index]);
    //}

    /*
    if (this.textContent === null || this.textContent === undefined || this.textContent === "") {
      return
    }
    else {

    }
    */

    console.log(this);
    result.push(this);
  });
  return result;
}

function displayFinancialStories(data) {
  //console.log(data);
  var getOnlyArticlesCNBC = function(linkObj) {
    var noExtraSitesPresent = linkObj.textContent.indexOf("Site Map") === -1 && linkObj.textContent.indexOf("About") === -1 && linkObj.textContent.indexOf("Stock Screener") === -1 && linkObj.textContent.indexOf("Fund Screener") === -1;
    return linkObj.href.indexOf("cnbc") !== -1 && linkObj.href.indexOf("/id/") !== -1 && noExtraSitesPresent;
  }
  var linkObjects = getLinksFromHtml(json2xml(data), getOnlyArticlesCNBC);
  stellaChat.html(stellaChat.html() + "<hr>");
  stellaChat.html(stellaChat.html() + "<h4>Latest Financial Stories</h4>");
  for (var i = 0; i < linkObjects.length; i++) {
    stellaChat.html(stellaChat.html() + '<p><a href=' + linkObjects[i].href + '>' + linkObjects[i].textContent + '</a></p>');
  }
}

function getFinancialStories(companyName) {
  //select * from html where url="http://search.cnbc.com/rs/search/view.html?source=CNBC.com&keywords=TWITTER"
  //https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fsearch.cnbc.com%2Frs%2Fsearch%2Fview.html%3Fsource%3DCNBC.com%26keywords%3DTWITTER%22&diagnostics=true
  //console.log(symbol);
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = function() {

  }
  //script.src = 'https://chartapi.finance.yahoo.com/instrument/1.0/' + tickerString + '/chartdata;type=quote;range=1d/json/?callback=financeAnalyze';
  //script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20pm.finance.graphs%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&diagnostics=true&callback=finance';
  //script.src = 'https://autoc.finance.yahoo.com/autoc?query=' + tickerString +
  script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fsearch.cnbc.com%2Frs%2Fsearch%2Fview.html%3Fsource%3DCNBC.com%26keywords%3D' + companyName + '%22&diagnostics=true&callback=displayFinancialStories';
  body.appendChild(script);
}

//Only use with trusted sources. This could potentially execute arbitrary JS code.
/*
function getTextFromHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  $(tmp).find("p").each(function() {
    console.log(this);
  });
  return tmp.textContent || tmp.innerText || "";
}
*/

function printStory(data) {
  //console.log("Data");
  //console.log(data);
  //cullJson(data, ["script", "class"])
  var xml = x2js.json2xml_str(data);

  //var text = getTextFromHtml(xml).replaceAll('&quot;', '"');
  console.log(xml);
}











//A comment to hold the line
