var map;
var infowindow;

var userLocation = null;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {userLocation = position;}, function(err) {}, {timeout:10000});
} else {
  console.log("Geolocation is not supported by this browser.");
}

function initMap() {
  /*
  var coord;
  if (userLocation !== null) {
    coord = {lat: userLocation.coords.latitude, lng: userLocation.coords.longitude};
  }
  else {
    coord = {lat: -33.867, lng: 151.195}; //"Pyrmont, Sydney, Australia"
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: coord,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: coord,
    radius: 500,
    type: ['store']
  }, mapCallback);
  */
}

function mapCallback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    console.log(place);
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
