function startDictation() {
  if (window.hasOwnProperty('webkitSpeechRecognition')) {
    var recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(e) {
      //document.getElementById('transcript').value = e.results[0][0].transcript;
      var speech = e.results[0][0].transcript;
      console.log(speech);

      executeCommand(speech);

      recognition.stop();
      //document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }
  }
  else {
    var icon = d3.select("#voice-chat").style("opacity", 0);
    stellaChat.html("<h3>I'm sorry, this browser does not support speech to text. Please use Google Chrome.</h3><br>" +
      "<h4>You may still enter in text commands.</h4>");
  }
}

function getJSessionId() {
    var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
    if (jsId != null) {
        if (jsId instanceof Array)
            jsId = jsId[0].substring(11);
        else
            jsId = jsId.substring(11);
    }
    return jsId;
}

var config = {
    server: 'wss://api-ws.api.ai:4435/api/ws/query',
    serverVersion: '20150910', // omit 'version' field to bind it to '20150910' or use 'null' to remove it from query
    token: '1e41f374eb964fd69d8cbb13da8725a6', // Use Client access token there (see agent keys).
    sessionId: getJSessionId(),
    onInit: function () {
        console.log("> ON INIT use config");
    }
};

var apiAi = new ApiAi(config);
