// feel free to remove this, it's just to help you make sure you're loading the correct file
console.log('hello world from punchcard.js!');

// set up chart area
var margin = { top: 20, right: 30, bottom: 30, left: 80 };

var totalWidth = 800 + margin.left + margin.right;
var totalHeight = 600 + margin.top + margin.bottom;

var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

// asynchronously load our barley.json data,
// and invoke the renderChart function upon a successful network request
d3.json('./data/barley.json', renderChart);

// set up scales!
var xScale = d3.scalePoint().padding(0.3);
var yScale = d3.scalePoint().padding(0.1);
var radius = d3.scaleSqrt();
var color = d3.scaleOrdinal();

// set up some axis functions
var yAxis = d3.axisLeft().scale(yScale);
var xAxis = d3.axisBottom()
  .tickFormat(function(d) { return d; })
  .scale(xScale);
  
//Keep track of these so we can use them in plotting and setting scales
var maxYield = null;  
var years = [];
var genTypes = [];

var svg = null;
var g = null;

var map = null;

//Listen for and emit certain custom events    
var dispatch = d3.dispatch("load", "statechange");

//dispatch.call (listen?)
//dispatch.on (respond)

//Emit once when loading, and emit every time the chart changes
    
    
// function that renders the punchcard chart and is passed to d3.json() above
// takes two args: error (object) which is passed if the network request failed
// data: (object) the JSON response, in this case an array of objects
function renderChart(error, data) {
  // check to see if something went wrong
  // "throw" the error which will prevent the rest of the code from running
  if (error) throw error;

  maxYield = d3.max(data, function(d) { return d.yield; });

  // create an array of the unique years in our dataset
  years = data.reduce(function(acc, cur) {
    if (acc.indexOf(cur.year) === -1) {
      acc.push(cur.year);
    }
    return acc;
  }, []);

  // create an array of the unique gen types in our dataset
  genTypes = data.reduce(function(acc, cur) {
    if (acc.indexOf(cur.gen) === -1) {
      acc.push(cur.gen);
    }
    return acc;
  }, []);

  var nested = d3.nest()
    .key(function(d) { return d.site; })
    .key(function(d) { return d.gen; })
    .entries(data);

  map = d3.map(nested, function(d) { return d.key; });

  //Dispatch events
  //Create a dropdown menu programmatically
  
  dispatch.call("load", this, map); //pass the map data to the function listening to the "emit"

  // this will create and update our chart
  //function updateChart(site) {}

  // first chart render
  //We did this manually originally to initialize the chart
  //updateChart(map.get('Morris'));

} // end renderChart

//Create a listener for "load" and continue to make a dropdown element for the UI

//Pass in the map we received earlier
dispatch.on('load.menu', function(map) { //Respond only to the specific dispatch event/callback "load.menu"
  var header = d3.select("body").append("div").attr("class", "header").style("width", totalWidth + "px"); //Programmatically create a new div to hold everything at the top
  header.append("h3").style("margin-left", "20px");
  
  var selectUI = header.append('select').on('change', function() {
    var site = this.value;
    dispatch.call("statechange", this, map.get(site));
  }); //When the user clicks on the UI to look for a new site name
  
  selectUI.selectAll("option") //Empty selection
    .data(map.keys().sort()) //Bind data
    .enter() //Since there is new data, enter() iterates through all the new UI elements
    .append("option") //Create a new "option" in the "select" DOM UI
    .attr("value", function(d) {return d;})
    .text(function(d) {return d;}) //General update pattern, kind of, for a coded UI element
    
  dispatch.on("statechange.menu", function(site) {
    selectUI.property("value", site.key); //Later on, we grab the site's value from the select option UI and then do an action on it
  });
});

//dispatch.on('statechange', function(site) { //The final event listener which takes in the full site and its data
  
//});

dispatch.on('load.chart', function(map) { //The second event listener which takes in the full site and its data
  //This resets all the graphics of the chart
  xScale.range([0, width]).domain(years);

  yScale.range([0, height]).round(true);

  color.range(d3.schemeCategory20).domain(genTypes);

  radius.range([0, 15]).domain([0, maxYield]);

  h3 = d3.select('body').append('h3').text('Hey!');

  svg = d3.select('body').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

  g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top +  ')');

  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);
});

dispatch.on('statechange.chart', function(site) { //The third event listener
  //It responds to a change in the UI and goes through the general update pattern again
  var t = g.transition().duration(750);

  yScale.domain(
    site.values.map(function (d) {
      return d.key;
    })
    .sort()
  );

  // reset the x axis yscale
  yAxis.scale(yScale);

  // redrawing the y axis
  t.select("g.y.axis").call(yAxis);

  // binding the outer most values array to the main svg group element
  g.datum(site.values);

  // create an empty selection of groups for each genetic variety of barley
  // bind data and set the data binding key
  var gens = g.selectAll('g.site')
    .data(
      function(d) { return d; },
      function(d) { return d.key; } // "key" here represents barely genetic variety
    );

  // remove group elements that no longer exist in our new data
  var removed = gens.exit().remove();

  // update existing groups left over from the previous data
  gens
    .transition(t)
    .attr('transform', function(d) {
      return 'translate(0, ' + yScale(d.key) + ')';
    });

  // create new groups if our new data has more elements then our old data
  gens.enter().append('g')
    .attr('class', 'site')
    .transition(t)
    .attr('transform', function(d) {
      return 'translate(0, ' + yScale(d.key) + ')';
    });

  // reselect our gen site groups
  gens = g.selectAll('g.site');

  // nested selection
  // empty selection of circles that may or may not yet exist
  // join inner values array for each gen type
  var circles = gens.selectAll('circle')
    .data(
      function(d) { return d.values; }, // represents our actual data
      function(d) { return d.year; }
    );

  // go through the general update pattern again
  // exit remove circles
  circles.exit()
    .transition(t)
    .attr('r', 0)
    .style('fill', 'rgba(255, 255, 255, 0)')
    .remove();

  // update existing circles
  circles
    .attr('cy', 0)
    .attr('cx', function(d) { return xScale(d.year); })
    .transition(t)
    .attr('r', function(d) { return radius(d.yield); })
    .attr('fill', function(d) { return color(d.gen); });

  // create new circles
  circles
    .enter().append('circle')
    .attr('cy', 0)
    .attr('cx', function(d) { return xScale(d.year); })
    .transition(t)
    .attr('r', function(d) { return radius(d.yield); })
    .attr('fill', function(d) { return color(d.gen); });

  h3.text(site.key);
});








//A comment to hold the line.
