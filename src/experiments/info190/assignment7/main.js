console.log('hello world!');

var margin = { top: 20, right: 20, bottom: 50, left: 50 };
var width = 600 - margin.left - margin.right;
var height = 320 - margin.top - margin.bottom;

var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

var g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.right})`);

var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

var baseURL = 'https://tidesandcurrents.noaa.gov/api/datagetter';

var params = {
  begin_date: '20171010',
  end_date: '20171011',
  interval: 'h',
  station: 9414290,
  product: 'predictions',
  datum: 'MSL',
  units: 'english',
  time_zone: 'lst',
  application: 'd3-tidal-chart',
  format: 'json',
};

var queryString = Object.keys(params)
  .reduce(function(str, key, idx, array) {
    str += key + '=' + params[key];

    if (idx !== array.length - 1) {
      str += '&'
    }

    return str;
  }, '');

var queryURL = baseURL + '?' + queryString;

var parseTime = d3.timeParse('%Y-%m-%d %H:%M'); //Convert a string time to a data time
var formatTime = d3.timeFormat('%b %d, %Y, %I %p'); //Convert a data time to a string time
var bisectDate = d3.bisector(function(d) {return d.t}).left; //Find the value, lookup, using left - use the leftmost value if overlapping x

d3.json(queryURL, function(error, res) {
  if (error) throw error;

  console.log(res);

  var data = res.predictions.map(function(d) {
    return {
      v: parseFloat(d.v, 10),
      t: parseTime(d.t),
    };
  });

  //"Loop" through the data values and accessor, finding the lowest
  var minValue = d3.min(data, function(d) {
    return d.v;
  });
  
  //Create a new object representing the full graph and which it draws x, y0 (top), y1 (bottom)
  valueArea = d3.area()
    .x(function(d) { return xScale(d.t); })
    .y0(function(d) { return yScale(d.v); })
    .y1(function(d) { return yScale(minValue); })
    .curve(d3.curveBasis);

  xScale.domain(d3.extent(data, function(d) { return d.t; }));
  yScale.domain(d3.extent(data, function(d) { return d.v; }));

  g.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', valueArea);

  g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale));

  // grid lines
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${height})`)
    .call(
      d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat('')
    );

  g.append('g')
    .attr('class', 'grid')
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-width)
        .tickFormat('')
    );
    
  //Programmatically append a new tooltip object
  var tooltip = g.append('g')
    .attr('class', 'tooltip')
    .style('display', 'none');
    
  //Define its properties with d3.js as well
  //This one is the vertical line
  tooltip.append('line')
    .attr('class', 'y-hover-line')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#000')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '3,3')
    
  //The horizontal line
  tooltip.append('line')
    .attr('class', 'x-hover-line')
    .attr('x1', 0)
    .attr('x2', height)
    .attr('stroke', '#000')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '3,3')
    
  //A circle also appended with the tooltip  
  tooltip.append('circle')
    .attr('r', 5)
    .attr('fill', '#eee')
    .attr('stroke', '#000')
    .attr('stroke-width', 4)
    
  var textbox = tooltip.append("g")
    .attr("class", "text-box")
    .attr("transform", "translate(10,10)")
    .style("display", "none");
    
  textbox.append('text')
    .attr('dy', "0.35em")
    .style("font-size", "12px")
    .append("tspan") //A class for holding the actual text data
    .text("Test");
    
  //The shape which will register the user's mouse movements
  
  g.append('rect')
    .attr('class', 'tooltip-overlay')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', function() { //These callbacks fire when the mouse does certain events within the invisible rect
      tooltip.style('display', 'initial'); //Make this tooltip visible when the mouse is within the screen
      textbox.style('display', 'initial');
    })
    .on('mouseout', function() {
      tooltip.style('display', 'none');
      textbox.style('display', 'none');
    })
    .on('mousemove', function() {
      var mouseCoord = d3.mouse(this); //When the mouse event is fired, transmit the x through d3.js
      var mouseX = mouseCoord[0];
    
      var xValue = xScale.invert(mouseX); //Normal xScale converts a data value to screen coord, reverse this function
      
      //We need to bisect the data so that we can find the prefer values,
      //since there are lots of missing datetime data values
      var index = bisectDate(data, xValue, 1);
      var dBefore = data[index - 1]; 
      var dAfter = data[index]; 
      var dCur = xValue - dBefore.t > dAfter.t - xValue ? dAfter : dBefore; //A ternary expression for using the closeset values to mouse
      
      tooltip.attr('transform', 'translate(' + xScale(dCur.t) + ',' + yScale(dCur.v) + ')');
      tooltip.select('.y-hover-line')
        .attr('y2', height - yScale(dCur.v));
      tooltip.select('.x-hover-line')
        .attr('x2', -xScale(dCur.t)); //This is negative because this is relative to the tooltip parent i.e. the left
       
      textbox.select('text').select('tspan').text(formatTime(dCur.t) + ", " + dCur.v + ".ft"); 
       
    });
});

//Keep in mind, you can either use npm.js to load module on a computer,
//or use unpkg to provide a CDN for some library.
//Lodash - throttle, limit for every N ms
//debounce, pass event when done scrolling/mouse moving

// console.log('this will finish before d3.json callback!');
