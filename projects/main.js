// SVG setup as usual

var totalWidth = $(window).width(), totalHeight = $(window).height();
var margin = { top: 20, right: 20, bottom: totalHeight * 0.2, left: 40 };
var smallMargin = { top: totalHeight * 0.8 + 30, right: 20, bottom: 30, left: 40 }; //The second SVG brush goes under the main display

var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;
var smallHeight = totalHeight - smallMargin.top - smallMargin.bottom

var svg = d3.select("body").append("svg")
  .attr("height", totalHeight)
  .attr("width", totalWidth);

//Two sets of d3 scales for each graphic
var xScale = d3.scaleTime().range([0, width]); //Special scale for time data
var yScale = d3.scaleLinear().range([height, 0]); //Remember to invert, like in previous classes
var smallXScale = d3.scaleLinear().range([0, width]);
var smallYScale = d3.scaleLinear().range([smallHeight, 0]);

//Decimal formatted axes
var timeFormat = d3.timeFormat("%Y %m");
var xAxis = d3.axisBottom(xScale).tickFormat(timeFormat);
var smallXAxis = d3.axisBottom(smallXScale).tickFormat(timeFormat);
var yAxis = d3.axisLeft(yScale); //Only need one y-axis for the main chart, since the brush is ~80 pixels high

//Our one-dimensional brush in the X-axis, moves from left to right
var brush = d3.brushX()
  .extent([[0, 0], [width, smallHeight]])
  .on('brush end', brushed); //Brush listener events, both brush and end



//Once again use d3 zoom to zoom across any generated SVG
var zoom = d3.zoom()
  .scaleExtent([1, Infinity]) //Restricts the zoom level
  .translateExtent([[0, 0], [width, height]]) //Restricts the range pan of the brush on the screen
  .extent([[0, 0], [width, height]]) //Restricts the render pan of the brush on the screen
  .on('zoom', zoomed); //Zoom event handler/listener

svg.append("defs").append("clipPath") //Turning on and off:
  .attr("id", "clip")
  .append("rect") //Clip the area within the margins i.e. past the axes
  .attr("width", width)
  .attr("height", height);

//Two group elements to store SVG objects for both graphs
//These are offset by their respective division margins

var focus = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + smallMargin.left + "," + smallMargin.top + ")");

var tooltip = svg.append("g")
  .attr("id", "tooltip")
  .attr("transform", "translate(0,0)")
  .style("opacity", 0.5);

var tests = null;
var bars = null;

//Async data load from csv, like before
//d3.csv("./data/pct_ca_generalized.csv", formatter, function(err, data) {

var storedData = null;

//General update pattern that can be called to update the timeline graph
function renderTimeline() {
  var focusRectHeight = height / 5;

  bars = tests.selectAll('g')
    .data(storedData);

  //Create a structure with the g svg element holding all elements transformed in chart coords,
  //with children offset at the new coords of the g element.

  //On hovering over the project card, show the tooltip
  bars
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return 'translate(' + xScale(d["start_date"]) + "," + (yScale(d["proj_id"]) - focusRectHeight) + ")";
    })
    .on("mouseover", function(d) {
      tooltip.style("opacity", 1.0);
      tooltip.select("text").text(d["tooltip"]);
      tooltip.attr("transform", function() {
        return "translate(" + xScale(d["start_date"]) + "," + (yScale(d["proj_id"]) - focusRectHeight) + ")";
      });
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0.0);
    });

  bars
    .enter()
    .selectAll("g")
    .append("rect")
    .style('fill', function(d,i) { return "white"; })
    .style('stroke', function(d,i) { return "steelblue"; })
    .attr('width', function(d) {
      //Figure out the transformation of the start and end dates into the screen,
      //then calculate a width based on that.
      //We assume that end_date is later than start_date
      return xScale(d["end_date"]) - xScale(d["start_date"]);
    })
    .attr('height', focusRectHeight);

  bars //This only has to be declared once, since it is in relation to the whole group element
    .enter()
    .selectAll("g")
    .append('text')
    .attr('x', function(d) {
      var renderWidth = xScale(d["end_date"]) - xScale(d["start_date"]);
      return renderWidth / 2;
    })
    .attr('y', focusRectHeight / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d["proj_name"];
    });

  //Update already existing elements when moved
  //This updates the rectangle widths and overall group positions
  bars
    .attr('transform', function(d) {
      return 'translate(' + xScale(d["start_date"]) + "," + (yScale(d["proj_id"]) - focusRectHeight) + ")";
    });

  bars.selectAll("rect")
    .attr('width', function(d) {
      //Figure out the transformation of the start and end dates into the screen,
      //then calculate a width based on that.
      //We assume that end_date is later than start_date
      return xScale(d["end_date"]) - xScale(d["start_date"]);
    })
    .attr('height', focusRectHeight);


}

//Async csv call, load in the data for the first time, store it
d3.csv("./data/projects_timeline.csv", formatter, function(err, data) {
  if (err) throw err;

  storedData = data;

  //We have to reset the domain scales to determine the extent of data
  xScale.domain(d3.extent(data, function(d) {
    return d["start_date"];
  }));
  smallXScale.domain(xScale.domain()); //Overloaded getter and setter, much like d.html("...") and d.html()
  yScale.domain([0, d3.max(data, function(d) {
    return d["proj_id"] + 1;
  })]); //Use d3.max to access a special property of the data
  smallYScale.domain(yScale.domain());

  //Main larger chart
  //Use datum for line and paths since there is only one object
  /*focus.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);*/ //Unenclosed area path generator

  tests = focus.append('g');

  //Axis groups in the SVG, which hold axis texts and ticks
  focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    /*
  //We no longer need this call, since there is no meaning to the y-axis in a timeline
  focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);
*/

  //The smaller chart brush
  /*context.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", smallArea);*/
  context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + smallHeight + ")")
    .call(smallXAxis);

  context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, xScale.range()); //Move brush to entire small graph area

  //Create a rect to listen for zoom events in the whole SVG
  /*var zoomRectListener = svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", smallHeight)
    .attr("transform", "translate(" + margin.left + "," + (smallMargin.top) + ")")
    .style("z-index", 5)
    .call(zoom);*/
  //Move the rect listener to the back so timeline tooltips hover over
  //zoomRectListener.moveToBack();

  renderTimeline();

  //Append a text object once for the tooltip svg group to use
  tooltip.append("text");

}); //The hiking trail elevation data


function brushed() {
  //d3.event Refers to the event generated by a d3 listener
  //Fire only when the user is done moving the brush
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; //Do not handle events related to zoom
  //d3.event.selection returns the pixel (not data) value of the selection
  var s = d3.event.selection || smallXScale.range();
  xScale.domain(s.map(smallXScale.invert, smallXScale)); //xScale.invert returns a map from pixel -> data
  //Set the domain of the main chart ^, and then update the areas
  //focus.select(".area").attr("d", area); //Recall the area path generator
  focus.select(".axis--x").call(xAxis); //Update the axis as well

  svg.select('.zoom')
    .call(
      zoom.transform,
      d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0)
    ); //Call a brush event, reset zoom

  renderTimeline();
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; //Do not handle events related to brush movement/zoom
  var t = d3.event.transform; //The k,x,y represent zoom and pan
  xScale.domain(t.rescaleX(smallXScale).domain());

  //Redraw everything again
  //focus.select(".area").attr("d", area); //Recall the area path generator
  focus.select(".axis--x").call(xAxis); //Update the axis as well

  //Also have to update the brush
  context.select(".brush")
    .call(
      brush.move,
      xScale.range().map(t.invertX, t)
    ); //Call brush.move, which sets the location of the brush

  renderTimeline();
}

//Row by row manipulate the rows of a CSV
//In this case we convert meter -> mile/ft
function formatter(row) {
  row["start_date"] = Date.parse(row["start_date"]);
  row["end_date"] = Date.parse(row["end_date"]);
  row["proj_id"] = +row["proj_id"];
  return row;
}












//A comment to hold the line.
