// making a d3 selection of the canvas element
var canvas = d3.select('canvas');
// then we get access to the Canvas Web API
var context = canvas.node().getContext('2d');

// width and height of canvas
var width = parseInt(canvas.attr('width'));
var height = parseInt(canvas.attr('height'));

// create a border around our whole drawing
context.strokeStyle = 'magenta';
context.strokeRect(0, 0, width, height);

// specify margins in an object
var margin = {
  top: 20,
  bottom: 40,
  left: 30,
  right: 20
};

// reassign width and height to account for margins
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

// translate the coordinate system origin by x & y pixels
context.translate(margin.left, margin.top);

// draw another rectangle to show the translated coordinate system
context.fillStyle = '#eee';
context.fillRect(0, 0, width, height);

// some sample data
// after you have the chart working try adding more values and changing values here then refreshing the page
// notice that d3 accomodates the extra values
var data = [21, 50, 10, 35, 90, 12, 67, 5, 180, 76];

// create a new y scale function and set its domain and range
// we're using scaleLinear because our values are continuous
var yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .rangeRound([height, 0]);

// create a new x scale function and set its domain and range
var xScale = d3.scaleBand()
  .domain(data)
  .range([0, width])
  .padding(0.1);

// tell canvas what fill color we want to use for our rectangles
context.fillStyle = 'steelblue';

// iterate over our data array
data.forEach(function(d, i) {
  // draw a rectangle that has a fill
  // fillRect takes 4 parameters x1, y1, x2, y2
  // think of those parameters as representing the upper left and lower right corners of our rectanlge
  context.fillRect(
    xScale(d), // use the xScale to set the starting x coordinate
    yScale(d), // use the yScale to set the starting y coordinate
    xScale.bandwidth(), // use the width of scaleBand to set the end x coordinate
    height - yScale(d) // subtracting the yScale value from height gives us the end y coordinate
  );

  // Compare the above code with trying to do this manually below
  // var barPadding = 5;
  // var barWidth = 30;

  // draw some bars!
  // context.fillRect(
  //   (i * barWidth) + barPadding,
  //   height - d,
  //   barWidth - barPadding,
  //   d
  // );
});

// Next, let's draw some x-axis tick marks at the bottom of our bars
// tell canvas we want to draw a new path
context.beginPath();

// iterate over x domain values
xScale.domain().forEach(function(d) {
  // we draw a line by moving the pen to a starting x,y coordinate
  context.moveTo(xScale(d) + xScale.bandwidth() / 2, height);
  // then create the line by specifying a coordinate for where to end up
  context.lineTo(xScale(d) + xScale.bandwidth() / 2, height + 10);
});

// lines are stored in memory above, but not yet rendered
// to render them we need to call the stroke() method
context.stroke();

// Add labels for the x-axis tick marks
// set some text properties so the label text is positioned correctly
context.textAlign = 'center';
context.textBaseline = 'top';

// set the text fill style to dark grey,
// note that if we don't change the color again after we specify it here,
// it will be used every other place we draw text, which is fine
context.fillStyle = '#333';

// iterate over our x domain values and render x axis tick labels
xScale.domain().forEach(function(d, i) {
  context.fillText(i, xScale(d) + xScale.bandwidth() / 2, height + 10);
});

// render labels for each bar's value
// set the text baseline to bottom
context.textBaseline = 'bottom';

// iterate over the x domain values and render bar labels
xScale.domain().forEach(function(d, i) {
  context.fillText(d, xScale(d) + xScale.bandwidth() / 2, yScale(d));
});

// grab an array of tick mark values for the y Axis
// note that we can pass a value specifying how many tick marks we'd like
// but the ticks() function doesn't gaurantee that's what we'll get!
// for example it seems to respect 4 here but changing to 6 or 8 gives us back 10 ticks
// read more: https://github.com/d3/d3-scale#continuous_ticks
var yTicks = yScale.ticks(4);

// iterate over each of our y tick values and create horizontal tick marks
// notice y position stays the same, and we move in negative x position
yTicks.forEach(function(d) {
  context.moveTo(0, yScale(d) + 0.5);
  context.lineTo(-6, yScale(d) + 0.5);
});
context.strokeStyle = "#333";
context.stroke();

// y axis labels
context.textAlign = 'right';
context.textBaseline = 'middle';

yTicks.forEach(function(d) {
  context.fillText(d, -9, yScale(d));
});

// Draw a vertical line for the actual y axis, (we didn't do this for the x axis but we could have)
context.beginPath();
context.moveTo(1, 1);
context.lineTo(1, height + 1);
context.stroke();

// Time to get fancy!
// We'll save the current context coordinate system state so we can come back to it later
context.save();
// rotate our coordinate system by 90 degrees counter clockwise
context.rotate(- Math.PI / 2);
// the usual stuff for setting text properties and rendering
context.textAlign = 'right';
context.textBaseline = 'top';
context.fillText('Fake Values', -5, 5);
// restore our context coordinate system back
context.restore();
