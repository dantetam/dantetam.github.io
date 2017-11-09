//Note that this script requires two objects to work effectively:

//jQuery has been imported
//ideally, a button with id "nightmode"

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  return null;
}

var nightModeEnabled = false;

var pageCounter = 0; //For a page history stack

//console.log(getQueryVariable("night"));

if (getQueryVariable("night") === "dark") {
  nightModeEnabled = true;
}

function changeUINight(mode) {
  if (mode) {
    //Go into night mode, with less bright blue and white colors
    $("a,h1,div,p,body,li,ul").css({ 
      'color': '#888888', 
      'background-color': '#000000' 
    });
    
    //Remove the black background from hover image captions
    $(".carousel-inner .item a p").css({
      'color': '#000000', 
      'background-color': '#00000000' 
    });

    //Shift the transition to be more gray, both within and outside a hover event
    $(".carousel-inner .item img").css({
      "-webkit-filter": "grayscale(70%)",
      "filter": "grayscale(70%)"
    });
    
    $(".carousel-inner:hover .item img").css({
      "-webkit-filter": "grayscale(100%)",
      "filter": "grayscale(100%)"
    });
    
    $("img").css({
      "-webkit-filter": "grayscale(70%)",
      "filter": "grayscale(70%)"
    });
  }
  else {
    //Reverse the effects of night mode
    $("a").css({ 
      'color': '#337ab7', 
      'background-color': '#00000000' 
    });
    
    $("h1,div,p,body,li,ul").css({ 
      'color': '#000000', 
      'background-color': '#ffffff' 
    });
    
    $(".carousel-inner .item a p").css({
      'color': '#337ab7', 
      'background-color': '#00000000' 
    });
    
    $(".carousel-inner .item img").css({
      "-webkit-filter": "grayscale(0%)",
      "filter": "grayscale(0%)"
    });
    
    $(".carousel-inner:hover .item img").css({
      "-webkit-filter": "grayscale(70%)",
      "filter": "grayscale(70%)"
    });
    
    $("img").css({
      "-webkit-filter": "grayscale(0%)",
      "filter": "grayscale(0%)"
    });
  }
}

changeUINight(nightModeEnabled); //Set to night mode, if the user query parameter has "night=dark"

$("#nightmode").click(function() {
  nightModeEnabled = !nightModeEnabled;
  changeUINight(nightModeEnabled);
  if (nightModeEnabled) { //Change the user's website in the browser bar, and add to website history stack
    window.history.pushState('page' + pageCounter, this.textContent, '/index.html?night=dark');
  }
  else {
    window.history.pushState('page' + pageCounter, this.textContent, '/index.html');
  }
  pageCounter++;
});