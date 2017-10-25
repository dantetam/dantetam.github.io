console.log("Hello World");

//SVG setup as usual

var totalWidth = 1000;
var totalHeight = 500;

var margin = {top: 20, right: 30, bottom: 30, left: 120};
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", totalWidth)
  .attr("height", totalHeight);
  
//The main parent group
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleTime().range([0, width]); //Convert datetimes to the range (0, width)
var yScale = d3.scaleLinear().range([height, 0]);
  
//Line generator that returns new line elements
var valueLine = d3.line()
  .x(function(d) {return xScale(d.t);})
  .y(function(d) {return yScale(d.v);})
  .curve(d3.curveBasis);

//
var baseURL = 'https://tidesandcurrents.noaa.gov/api/datagetter';  
  
//Query parameters  
baseURL += "?";
baseURL += 'begin_date=20171010' + '&';
baseURL += 'end_date=20171011' + '&';  
baseURL += 'interval=h' + '&';
baseURL += 'station=9414290' + '&';
baseURL += 'product=predictions' + '&';
baseURL += 'datum=MSL' + '&';
baseURL += 'units=english' + '&';
baseURL += 'time_zone=lst' + '&';
baseURL += 'application=ChrisHenrickBasedD3JSCourse' + '&';
baseURL += 'format=json';

/*
var queryString = Object.keys(params) //params is a dictionary of key-value query pairs
  .reduce(function(str, key, idx, array) {
    str += key + "=" + params[key];
    
    if (idx !== array.length - 1) {
      str += "&";
    } 
    
    return str;
  }, '');
*/

console.log(baseURL);

//This function is put into the callback queue
d3.json(baseURL, function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
 
  //2017-10-10 04:00
  var parseTime = d3.timeParse('%Y-%m-%d %H:%M');
  
  var data = res.predictions.map(function(d) {
    return {
      v: +d.v,
      t: parseTime(d.t)
    }; //Convert string to number
  });
  
  console.log(data);

  xScale.domain(d3.extent(data, function(d) { //Return the min/max value of a dataset, accessed
    return d.t; //Get all the dates of every data object
  }));  
    
  yScale.domain(d3.extent(data, function(d) {
    return d.v;
  }));
  
  g.append('path') //Take all data and bind it to a single object, this creates one line (as opposed to many circles)
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', "steelblue")
    .attr('stroke-width', 3)
    .attr('d', valueLine);
    
  g.append('g') //Append a new group for the x axis
    .attr('transform', 'translate(0,' + height + ')')  
    .call(d3.axisBottom(xScale));
  
  g.append('g') //Append a new group for the y axis  
    .call(d3.axisLeft(yScale));
    
  g.append('g')
    .attr('class', 'grid')
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""))
    .style("stroke", "lightgrey")
    .style("stroke-opacity", 0.7)
    .style("shape-rendering", crispEdges);
  
  g.append('g')
    .attr('class', 'grid')
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""))
    .style("stroke", "lightgrey")
    .style("stroke-opacity", 0.7)
    .style("shape-rendering", crispEdges);
   
});












// A comment to hold the line.