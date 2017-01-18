/**
 * Make a X-Domain request to url and callback.
 *
 * @param url {String}
 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
 * @param data {String} request body
 * @param callback {Function} to callback on completion
 * @param errback {Function} to callback on error
 */
function xdr(url, method) {
    var req;

    if(XMLHttpRequest) {
        req = new XMLHttpRequest();

        if('withCredentials' in req) {
            req.open(method, url, true);
            req.onerror = errback;
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status >= 200 && req.status < 400) {
                        callback(req.responseText);
                    } else {
                        errback(new Error('Response returned with non-OK status'));
                    }
                }
            };
            req.send(null);
            //req.send(data);
        }
    } else if(XDomainRequest) {
        req = new XDomainRequest();
        req.open(method, url);
        req.onerror = errback;
        req.onload = function() {
            console.log(req.responseText);
            //callback(req.responseText);
        };
        req.send(data);
    } else {
        console.log("CORS not supported.");
        //errback(new Error('CORS not supported'));
    }
}

function getWikipediaContentForSubjects(subjects) {
  for (var i = 0; i < subjects.length; i++) {
    xdr

    /*
    var pages = rawContent["query"]["pages"];
    var keys = Object.keys(pages);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] !== -1) {
        var pageContent = pages[keys[j]]["revisions"]["*"];
        console.log(pageContent);
      }
    }
    */
  }
}

getWikipediaContentForSubjects(["Water"]);











//A comment to hold the line.
