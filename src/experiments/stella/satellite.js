//AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA

//Combine this file with maps.js?

//Use Google Static API here
function getSatelliteImage(locationString, zoomLevel=14) {
  var imageLink = 'https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=' + locationString.trim() + '&zoom=' + zoomLevel + '&size=640x640&key=AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA';
  return imageLink.replace(/ /g, "+");
}

function getInfoOfPlace(placeString) {
  //Demographic information, coords
  //For cities, things like population, income per capita, etc.
}

//Use Maps API?
function getNearbyPlaces(place) {
  //Get nearby places for the adventure function
  //which plans a random vacation and story across some area.
}

function getLocationDetailsByCoord(coordX, coordY) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?";
  url += "latlng=" + coordX + "," + coordY;
  url += "&key=AIzaSyBOB0Y9Scm49yD6qivnBPTxmoA5Q7cZQFA";

}

//Google Street View API?













// A comment to hold the line.
