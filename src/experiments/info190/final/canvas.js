var width = 900, height = 500;

var currentMode = "total_pop";
//Create the button that we use to toggle between visualization modes
var toggleButton = d3.select("body").append("button").text("Total Population");

var ratio = window.devicePixelRatio || 1;

var canvas = d3.select('body')
  .append('canvas')
  //.style("position", "absolute")
  .attr('width', width * ratio)
  .attr('height', height * ratio)
  .style("width", width + "px")
  .style("height", height + "px"); //"Progressive enhancement" for those with Retina displays

  
  
var ctx = canvas.node().getContext('2d'); //Return a context to draw within, from the DOM element within canvas
ctx.scale(ratio, ratio);

var svg = d3.select("body")
  .append("svg")
  .attr('width', (width * 0.25) * ratio)
  .attr('height', height * ratio)
  .style("position", "fixed")
  .style("z-index", 1);

var area = d3.scaleSqrt()
  .range([10,50]); //Scale the actual proportion of circles
 
var color = d3.scaleLinear()
  .interpolate(d3.interpolateHcl)
  .range(['#FFFFFF', '#555599']);
  //.range(['#007AFF', '#FEB24C']); //Interpolate between two end colors

//A 2D subsearching binary tree-ish object, from the d3 library, for searching for selections
var quadtree = d3.quadtree().x(function(d) {return d.x;}).y(function(d) {return d.y;}).extent([0,0],[width,height]);
  
d3.queue() //Set up callbacks to fire after one another
  .defer(d3.json, './data/us-states-centroids.json')
  .defer(d3.csv, './data/acs_pop_income.csv') //Call the function on the left with the argument on the right
  .await(main) //Once done with the queue, execute a final callback
  
var minCircleRadius = 10;  
var projection = d3.geoAlbersUsa();
var populationCentersLoc = d3.map();
var commaFormat = d3.format(",.0f"); //Format with commas and no decimal places
  
var simulation = null;  
var extent = null;
var forceCollide = null; //Initiailize the force collide in this scope, because
//later we need to update the radii and then the collisions

var tree = null;

var legend = null; //Check this variable in global scope so we can update it later

function main(error, geojson, state_data) { //, gdp_data) {
  if (error) throw error; //Catch propogating errors
  
  var data = state_data.map(function(d) {
    //The d3.map hashmap we've seen in previous classes
    //populationMap.set(+d.id, +d.total_pop);
    return {
      id: d.id,
      name: d.name,
      total_pop: +d.total_pop,
      median_income: +d.median_income,
      state_abbr: d.state_abbr //Note that I manually added this data to the CSV
      //Return the first (and ideally, only) result from the search results array
    };
  }); //Much like a lambda, with an iterator accessor
  
  extent = d3.extent(data, function(d) { //Find min and max of data
    return d[currentMode];
  });
  
  //Process the geojson data. Here we must link the coordinates given in "geojson" 
  //to their force representations, by using their common ids
  
  //From the doc, we project the coordinates, and parse the other properties of the data,
  //such as the latlon, which can be reprojected when the user switches the visualization
  var nodes = geojson.features.map(function(d) {
    var point = projection(d.geometry.coordinates);
    populationCentersLoc.set(+d.id, point);    
        
    /*    
    return {
      id: +d.id,
      name: d.properties.name,
      label: d.properties.label,
      coords: d.geometry.coordinates,
      //x: point[0],
      //y: point[1],
      //x0: point[0],
      //y0: point[1],
      //r: Math.max(area(value), minCircleRadius),
      //value: value
    };
    */
  });
  
  data.forEach(function(d) {
    if (populationCentersLoc.get(+d.id) === undefined) {
      return d;
    }
    d.x = populationCentersLoc.get(+d.id)[0];
    d.y = populationCentersLoc.get(+d.id)[1];
    d.x0 = populationCentersLoc.get(+d.id)[0];
    d.x1 = populationCentersLoc.get(+d.id)[1]; 
    return d;
  });
  
  console.log(data);
  
  area.domain(extent); //Normalize the scales to the min and max of data
  color.domain(extent); //Same for the colors, so the color function knows the "strength" of colors
  
  forceCollide = d3.forceCollide().strength(1).radius(function(d) {
    var radius = Math.max(area(d[currentMode]), minCircleRadius)
    return radius;
  });
  
  //Create a force simulation object in d3, chain some forces
  simulation = d3.forceSimulation(data)
    .force('charge', d3.forceManyBody().strength(2))
    //.force('center', d3.forceCenter(width / 2, height / 2)) //Create forces around an (x, y) point
    .force('collision', forceCollide) //Handle physical collisions, use the radius around circle as a no-collision zone
    .on('tick', ticked) //An event listener for setting time
    .alphaMin(0); //Never stop updating the simulation, from d3-force docs
  //This will chain on some physical force properties to the data  
    
  var tooltip = d3.select('body').append('div') //Simple HTML tooltip
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('color', '#EEEEEE')
      .style('padding', '8px')
      .style('background-color', '#626D71')
      .style('border-radius', '6px')
      .style('text-align', 'center')
      .style('font-family', 'sans-serif');    
    
  //Start drawing on the SVG for the legend
  svg.append("g").attr("class", "legend").attr("transform", "translate(0, 0)");  
    
  //Create a legend using the d3 legend library
  legend = d3.legendColor().title("Total Population per State").titleWidth(75).scale(color);
  legend.labelFormat(commaFormat); //Use the no decimal formatter and d3 legend library
  svg.select(".legend").call(legend);
    
  //On click event listener  
  toggleButton.on("click", function() {
    simulation.alpha(1);
    simulation.restart(); //According the d3 docs, this "reheats" or activates the force simulation
    var legendTitle = null;
    //which tends to stop after 300 ticks
    if (currentMode === "total_pop") {
      currentMode = "median_income";
      legendTitle = "Median Income per Capita, by State";
      toggleButton.text("Median Income");
      area = function(d) {
        return 20;
      };
      //Since area just returns 20 (i.e. it's not a d3 object), don't use area.domain
    }
    else {
      currentMode = "total_pop";
      legendTitle = "Total Population by State";
      toggleButton.text("Total Population");
      area = d3.scaleSqrt()
        .range([10,50]); //Scale the actual proportion of circles
    }
    
    extent = d3.extent(data, function(d) { //Find min and max of data
      return d[currentMode];
    });
    if (currentMode === "total_pop") {
      area.domain(extent); 
    }
    
    //Reset the color scheme of the data so it matches the current dataset
    color.domain(extent);
    
    console.log(extent);

    //After updating the color function, update the legend
    legend.title(legendTitle); //.titleWidth(75).scale(color);
    svg.select(".legend").call(legend);  
    
    //Update collision boundaries
    forceCollide.initialize(simulation.nodes());

    //Move circles to current positions
    simulation.nodes().forEach(function(d) {
      if (populationCentersLoc.get(+d.id) === undefined) {
        return d;
      }
      d.x = populationCentersLoc.get(+d.id)[0];
      d.y = populationCentersLoc.get(+d.id)[1];
      d.x0 = populationCentersLoc.get(+d.id)[0];
      d.x1 = populationCentersLoc.get(+d.id)[1]; 
      return d;
    });
  });  
    
  function ticked() {
    //Draw circles using the canvas
    ctx.clearRect(0, 0, width, height); //Clear the whole screen/drawing area
    
    //Instead of general update pattern, a forEach loop going through every circle
    
    //Possibly check later for a dpi ratio to provide the best experience for all users? Especially Apple users with Retina displays
    data.forEach(function(d) {
      ctx.beginPath();
      var radius = Math.max(area(d[currentMode]), minCircleRadius)
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2.0);
      ctx.stroke();
      ctx.fillStyle = color(d[currentMode]); //Same rendering procedures from class 3
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2;
      ctx.fill();
      
      //Canvas is more efficient in hardware acceleration
      ctx.fillStyle = '#000000';
      
      if (radius < 8) { //Do not render text for smaller circles

      }
      else {
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.state_abbr, d.x, d.y); //Position a text at the position
      }
     
    });
    
    //The results of the quadtree is a globally accessed variable
    tree = quadtree.addAll(data); //Recompute the quadtree so that it's accurate for hover events
  }
  
  canvas.on('mousemove', function() { //When the user hovers over the canvas area...
    if (tree === null || tree === undefined) { //There may be no quadtree on initialization
      return;
    }
  
    var mouse = d3.mouse(this); //Get mouse handler event
    var closest = tree.find(mouse[0], mouse[1]);
    
    //closest.total_pop.toLocaleString()?
    tooltip.style("top", d3.event.pageY + 'px').style("left", d3.event.pageX + "px") //Move the tooltip to the mouse's position
      .html(closest.name + "<br>" + commaFormat(closest[currentMode])); //Using the element we searched for and find...
  });
  
  canvas.on('mouseover', function() {
    tooltip.style("visibility", "visible");
  });
  
  canvas.on('mouseout', function() {
    tooltip.style("visibility", "hidden");
  });
}


  
  
  
  
  
  
  
  
  
  
//A comment to hold the line.