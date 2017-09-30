var width = 960,
    height = 500,
    margin = { top: 20, right: 20, bottom: 30, left: 40 };

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// reduce our width and height by our margins
// We adjust for the true width and height of the graphics within the svg
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

// Nice pattern for generating domain and range functions,
// which convert the data into screen coordinates
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    yScale = d3.scaleLinear().rangeRound([height, 0]);

// create a formatter function for our labels at the top of the bars
var formatter = d3.format('.1%');

// create an svg group element and translate its position from the default origin
// This is useful since we can transform this group element as a whole
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
// Nice little color scheme for show
var blues = d3.schemeBlues[9];
console.log(blues);

// our function that will set up and draw our chart
// takes an argument "dataset" which is an array of objects.
// More specifically, an array of dictionaries or key-value pairs
function main(dataset) {
  console.log(dataset);

  xScale.domain(dataset.map(function(d) {
    return d.letter;
  }));

  yScale.domain([
    0,
    d3.max(dataset, function(d) { return d.frequency; })
  ]);
  
  //Note that we use the chained append/attr pattern quite a lot
  //to create new graphics for use.

  // create the x axis
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(xScale));

  // create the y axis
  g.append('g')
    .attr('class', 'axis axis--y') // give our x axis group a class of axis axis--y
    .call(
      d3.axisLeft(yScale).ticks(10, '%')
    )
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

  // create svg rectangle elements for each letter / data point
  g.selectAll('.bar') //Create the "empty" or "future" selection
    .data(dataset) //Iterate through the dataset, which we'll use custom callbacks/lambdas on
    .enter().append('rect') //Joins the data to the elements
    .attr('class', 'bar')
    .attr('x', function(d) { 
      return xScale(d.letter); //Note the use of this d3 generated func to convert domain -> screen range
    })
    .attr('y', function(d) {
      return yScale(d.frequency); //Same here, as above
    })
    .attr('style', function(d) {
      var blueIndex = parseInt(d.frequency*80.0) + 1;
      blueIndex = Math.min(blueIndex, blues.length - 1);
      var color = blues[blueIndex];
      return "fill:" + color + ";";
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function(d) {
      return height - yScale(d.frequency);
    });

  // create labels for the top of each bar
  g.selectAll('.bar-label')
      .data(dataset)
      .enter().append('text')
      .text(function(d) {
        // format labels!!!
        return formatter(d.frequency);
      })
      .attr('class', 'bar-label')
      /*
      .attr('x', function(d) {
        return xScale(d.letter);
      })
      .attr('y', function(d) {
        return yScale(d.frequency) - 2;
      });
      */
      .attr("transform", function(d) {
        //Create a custom translation and rotation, with strings
        //Always translate first and then rotate,
        //since we must shift the coordinate frame,
        //and then rotate around the coordinate frame.
        return "translate(" + (xScale(d.letter) + 5) + "," + (yScale(d.frequency) - 5) + ") rotate(-45)";
      });
      
      //rotate("+nAngle+")

}

main(data);
