// url='http://chartapi.finance.yahoo.com/instrument/1.0/YHOO%2CAAPL%2CGOOG%2CMSFT/chartdata;type=quote;range=1d/xml'

function pss(data) {
  //console.log("Call");
  console.log(data);
}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

function stockSymbolLookup(companyNames) {
  for (var i = 0; i < companyNames.length; i++) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {

    }
    script.src = 'https://autoc.finance.yahoo.com/autoc?query=' + companyNames[i] + '&region=1&lang=en&callback=pss';
    //console.log('http://autoc.finance.yahoo.com/autoc?query=' + companyNames[i] + '&region=1&lang=en&callback=parseStockSymbol')
    document.getElementsByTagName('body')[0].appendChild(script);
  }
}

stockSymbolLookup(["Apple", "Twitter", "Facebook", "Google"]);

function getDataForSymbols(listOfStockSymbols) {
  var tickerString = "";
  for (var i = 0; i < listOfStockSymbols.length; i++) {
    tickerString += listOfStockSymbols;
    if (i !== listOfStockSymbols.length - 1) {
      tickerString += "%2C";
    }
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = function() {

  }
  script.src = 'http://chartapi.finance.yahoo.com/instrument/1.0/' + tickerString + '/chartdata;type=quote;range=1d/xml';
  body.appendChild(script);
}

//Only use with trusted sources. This could potentially execute arbitrary JS code.
function getTextFromHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  $(tmp).find("p").each(function() {
    console.log(this);
  });
  return tmp.textContent || tmp.innerText || "";
}

function printStory(data) {
  //console.log("Data");
  //console.log(data);
  //cullJson(data, ["script", "class"])
  var xml = x2js.json2xml_str(data);

  //var text = getTextFromHtml(xml).replaceAll('&quot;', '"');
  console.log(xml);
}











//A comment to hold the line
