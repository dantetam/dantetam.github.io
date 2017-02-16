//AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA

//Combine this file with maps.js?

//Use Google Static API here
function getSatelliteImage(locationString, zoomLevel=14) {
  var imageLink = 'https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=' + locationString.trim() + '&zoom=' + zoomLevel + '&size=640x640&key=AIzaSyAP21EsKqlukt2dZGb766My2UwCAHTbD1U';
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

function getInfoOfPlaceGeneric(searchString, finalCallback) {
  var callback = function(data) {
    var location = data.results[0].geometry.location;
    var lat = location.lat;
    var lng = location.lng;
    getLocationDetailsByCoord(lat, lng, finalCallback);
  }

  var geocodeRequestUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + searchString + "&key=AIzaSyAP21EsKqlukt2dZGb766My2UwCAHTbD1U";

  $(document).ready(function() {
    $.ajax({
      url: geocodeRequestUrl,
      dataType: 'json',
      success: function(data) {
        callback(data);
      }
    });
  });
}

getInfoOfPlaceGeneric("New York", function(data, lat, lng) {});

//Use Maps API?
function getNearbyPlaces(place) {
  //Get nearby places for the adventure function
  //which plans a random vacation and story across some area.
}

function getLocationDetailsByCoord(coordX, coordY, callback=function(data, lat, lng) {console.log(data);}) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?";
  url += "latlng=" + coordX + "," + coordY;
  url += "&key=AIzaSyAP21EsKqlukt2dZGb766My2UwCAHTbD1U";

  //console.log(url);

  $(document).ready(function() {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        callback(data, coordX, coordY);
      }
    });
  });
}

//Google Street View API?













// A comment to hold the line.
