//AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA

//Combine this file with maps.js?

//Use Google Static API here
function getSatelliteImage(locationString, zoomLevel=14) {
  var imageLink = 'https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=' + locationString.trim() + '&zoom=' + zoomLevel + '&size=640x640&key=AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA';
  return imageLink.replace(/ /g, "+");
}

function getInfoOfPlace(placeString, finalCallback) {
  //Demographic information, coords
  //For cities, things like population, income per capita, etc.
  var callback = function(data) {
    var info = getMainBoxData(data);
    //console.log(info);
    finalCallback(info);
  };
  getWikipediaInfo([placeString], callback);
}

//Use Maps API?
function getNearbyPlaces(place) {
  //Get nearby places for the adventure function
  //which plans a random vacation and story across some area.
}

function getLocationDetailsByCoord(coordX, coordY, callback) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?";
  url += "latlng=" + coordX + "," + coordY;
  url += "&key=AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA";

  $(document).ready(function() {
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        callback(data);
      }
    });
  });
}

//Google Street View API?













// A comment to hold the line.
